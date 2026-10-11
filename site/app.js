// Wires the inputs to the calculation logic in calc.js.
import { simulate, monthsToGoal } from "./calc.js";
import { parseAmount, formatAmount, digitsBefore, positionAfterDigits } from "./amount.js";

const inputs = document.getElementById("inputs");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

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
    return { error: "La rentabilidad debe estar entre -50% y 50%.", fieldId: "rate" };
  }
  if (!(Number.isInteger(years) && years >= 1 && years <= 80)) {
    return { error: "El plazo debe ser un número entero de años, entre 1 y 80.", fieldId: "years" };
  }
  if (goal !== null && !(goal > 0)) {
    return { error: "La meta debe ser mayor que 0.", fieldId: "goal" };
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
  if (years > 0) parts.push(years === 1 ? "1 año" : years + " años");
  if (months > 0) parts.push(months === 1 ? "1 mes" : months + " meses");
  return parts.join(" y ");
}

function renderGoal(values) {
  const goalResult = document.getElementById("goal-result");

  if (values.goal === null) {
    goalResult.hidden = true;
    return;
  }

  const months = monthsToGoal(values);
  if (months === 0) {
    goalResult.textContent = "Ya alcanzaste tu meta con el monto inicial.";
  } else if (months === null) {
    goalResult.textContent = "Con estos números no alcanzas la meta de " + format(values.goal) + " en 100 años.";
  } else {
    goalResult.textContent = "Alcanzas tu meta de " + format(values.goal) + " en " + describeMonths(months) + ".";
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
    bar.setAttribute("aria-label", contributedPercent + "% aportado, " + (100 - contributedPercent) + "% intereses");
  } else {
    bar.setAttribute("aria-label", "100% aportado, sin intereses a favor");
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

  document.getElementById("hero-label").textContent =
    "Saldo final en " + (values.years === 1 ? "1 año" : values.years + " años");
  document.getElementById("final-balance").textContent = format(last.balance);
  document.getElementById("final-contributed").textContent = format(last.contributed);
  document.getElementById("final-interest").textContent = format(last.interest);

  renderBar(last);
  renderGoal(values);
  renderTable(rows);

  document.getElementById("announce").textContent =
    "Saldo final " + format(last.balance) + ", de los cuales " + format(last.interest) + " son intereses.";
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

inputs.addEventListener("input", (event) => {
  if (event.target.classList.contains("amount")) {
    reformatAmountInput(event.target);
  }
  render();
});

render();
