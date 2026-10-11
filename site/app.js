// Wires the inputs to the calculation logic in calc.js.
import { simulate, monthsToGoal } from "./calc.js";
import { parseAmount, formatAmount, digitsBefore, positionAfterDigits } from "./amount.js";
import { languages, messages } from "./i18n.js";

const inputs = document.getElementById("inputs");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

// The chosen language is remembered in this browser only. Storage can be blocked
// (e.g. private mode), so failures fall back to the browser language or Spanish.
const languageStorageKey = "language";

function initialLanguage() {
  try {
    const saved = localStorage.getItem(languageStorageKey);
    if (languages.includes(saved)) {
      return saved;
    }
  } catch {
    // Ignore: fall back below.
  }
  if (navigator.language.toLowerCase().startsWith("pl")) {
    return "pl";
  }
  return "es";
}

let language = initialLanguage();

function text() {
  return messages[language];
}

function format(value) {
  return "$" + formatAmount(Math.round(value));
}

function field(id) {
  return document.getElementById(id);
}

// Empty amount fields count as 0, so clearing a field to retype it doesn't show an error.
function readAmountOrZero(id) {
  const text = field(id).value.trim();
  if (text === "") {
    return 0;
  }
  return parseAmount(text);
}

function readNumber(id) {
  const text = field(id).value;
  if (text === "") {
    return NaN;
  }
  return Number(text);
}

// Returns the inputs, or { error, fieldId } if any of them is invalid.
function readInputs() {
  const initial = readAmountOrZero("initial");
  const monthly = readAmountOrZero("monthly");
  const ratePercent = readNumber("rate");
  const years = readNumber("years");
  const goalText = field("goal").value.trim();
  const goal = goalText === "" ? null : parseAmount(goalText);

  if (!(ratePercent >= -50 && ratePercent <= 50)) {
    return { error: text().rateError, fieldId: "rate" };
  }
  if (!(Number.isInteger(years) && years >= 1 && years <= 80)) {
    return { error: text().yearsError, fieldId: "years" };
  }
  if (goal !== null && !(goal > 0)) {
    return { error: text().goalError, fieldId: "goal" };
  }

  return {
    initial: initial,
    monthly: monthly,
    annualRate: ratePercent / 100,
    years: years,
    goal: goal,
  };
}

// Marks only the given field as invalid (or none, with null) and links it to the error message.
function markInvalidField(invalidId) {
  for (const input of inputs.querySelectorAll("input")) {
    const describedBy = [];
    if (input.dataset.help) describedBy.push(input.dataset.help);

    if (input.id === invalidId) {
      input.setAttribute("aria-invalid", "true");
      describedBy.push("error");
    } else {
      input.removeAttribute("aria-invalid");
    }

    if (describedBy.length > 0) {
      input.setAttribute("aria-describedby", describedBy.join(" "));
    } else {
      input.removeAttribute("aria-describedby");
    }
  }
}

function describeMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [];
  if (years > 0) parts.push(text().years(years));
  if (months > 0) parts.push(text().months(months));
  return parts.join(text().and);
}

function renderGoal(values) {
  const goalResult = document.getElementById("goal-result");

  if (values.goal === null) {
    goalResult.hidden = true;
    return;
  }

  const months = monthsToGoal(values);
  if (months === 0) {
    goalResult.textContent = text().goalAlreadyReached;
  } else if (months === null) {
    goalResult.textContent = text().goalNotReached(format(values.goal));
  } else {
    goalResult.textContent = text().goalReached(format(values.goal), describeMonths(months));
  }
  goalResult.hidden = false;
}

// One bar split into contributed vs interest. With zero or negative interest,
// the bar is all "contributed".
function renderBar(last) {
  const bar = document.getElementById("bar");
  const contributedSegment = document.getElementById("bar-contributed");

  let contributedPercent = 100;
  if (last.interest > 0) {
    contributedPercent = Math.round((last.contributed / last.balance) * 100);
  }
  contributedSegment.style.width = contributedPercent + "%";

  if (last.interest > 0) {
    bar.setAttribute("aria-label", text().barSplit(contributedPercent, 100 - contributedPercent));
  } else {
    bar.setAttribute("aria-label", text().barNoInterest);
  }
}

function renderTable(rows) {
  const tableBody = document.getElementById("table-body");
  tableBody.replaceChildren();

  for (const row of rows) {
    const tr = document.createElement("tr");
    const values = [row.year, format(row.contributed), format(row.interest), format(row.balance)];
    for (const value of values) {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  }
}

function render() {
  const values = readInputs();

  if (values.error) {
    // Keep the last results on screen, dimmed, so the page doesn't jump while typing.
    errorBox.textContent = values.error;
    errorBox.hidden = false;
    results.classList.add("stale");
    markInvalidField(values.fieldId);
    return;
  }

  errorBox.hidden = true;
  results.classList.remove("stale");
  markInvalidField(null);

  const rows = simulate(values);
  const last = rows[rows.length - 1];

  document.getElementById("hero-label").textContent = text().heroLabel(values.years);
  document.getElementById("final-balance").textContent = format(last.balance);
  document.getElementById("final-contributed").textContent = format(last.contributed);
  document.getElementById("final-interest").textContent = format(last.interest);

  renderBar(last);
  renderGoal(values);
  renderTable(rows);

  document.getElementById("announce").textContent = text().announce(format(last.balance), format(last.interest));
}

// Adds thousands separators while typing, keeping the cursor after the same digit.
function reformatAmountInput(input) {
  const typed = input.value;
  const value = parseAmount(typed);
  if (Number.isNaN(value)) {
    input.value = "";
    return;
  }
  const digitCount = digitsBefore(typed, input.selectionStart);
  const formatted = formatAmount(value);
  input.value = formatted;
  const position = positionAfterDigits(formatted, digitCount);
  input.setSelectionRange(position, position);
}

// Swaps every static text marked with data-i18n, and marks the active language button.
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = text().pageTitle;
  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = text()[element.dataset.i18n];
  }
  for (const element of document.querySelectorAll("[data-i18n-label]")) {
    element.setAttribute("aria-label", text()[element.dataset.i18nLabel]);
  }
  for (const button of document.querySelectorAll("[data-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  }
}

document.querySelector(".lang-switch").addEventListener("click", (event) => {
  const button = event.target.closest("[data-lang]");
  if (!button) {
    return;
  }
  language = button.dataset.lang;
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch {
    // Ignore: the choice just won't be remembered next time.
  }
  applyLanguage();
  render();
});

inputs.addEventListener("input", (event) => {
  if (event.target.classList.contains("amount")) {
    reformatAmountInput(event.target);
  }
  render();
});

applyLanguage();
render();
