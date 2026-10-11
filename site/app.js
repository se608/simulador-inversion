// Wires the form to the calculation logic in calc.js.
import { simulate, monthsToGoal } from "./calc.js";

const form = document.getElementById("form");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

const numberFormat = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });

function format(value) {
  return "$" + numberFormat.format(value);
}

function readNumber(name) {
  const raw = form.elements[name].value;
  if (raw === "") {
    return NaN;
  }
  return Number(raw);
}

// Returns the inputs, or an error message if any of them is invalid.
function readInputs() {
  const initial = readNumber("initial");
  const monthly = readNumber("monthly");
  const ratePercent = readNumber("rate");
  const years = readNumber("years");
  const goalRaw = form.elements.goal.value;
  const goal = goalRaw === "" ? null : Number(goalRaw);

  if (!(initial >= 0)) return { error: "El monto inicial debe ser 0 o mayor." };
  if (!(monthly >= 0)) return { error: "El aporte mensual debe ser 0 o mayor." };
  if (!(ratePercent >= -50 && ratePercent <= 50)) return { error: "La rentabilidad debe estar entre -50% y 50%." };
  if (!(Number.isInteger(years) && years >= 1 && years <= 80)) return { error: "Los años deben ser un número entero entre 1 y 80." };
  if (goal !== null && !(goal > 0)) return { error: "La meta debe ser mayor que 0." };

  return {
    initial: initial,
    monthly: monthly,
    annualRate: ratePercent / 100,
    years: years,
    goal: goal,
  };
}

function describeMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const parts = [];
  if (years > 0) parts.push(years === 1 ? "1 año" : years + " años");
  if (months > 0) parts.push(months === 1 ? "1 mes" : months + " meses");
  return parts.join(" y ");
}

function renderGoal(inputs) {
  const goalResult = document.getElementById("goal-result");

  if (inputs.goal === null) {
    goalResult.textContent = "";
    return;
  }

  const months = monthsToGoal(inputs);
  if (months === 0) {
    goalResult.textContent = "Ya alcanzaste tu meta con el monto inicial.";
  } else if (months === null) {
    goalResult.textContent = "Con estos números no alcanzas la meta en 100 años.";
  } else {
    goalResult.textContent = "Alcanzas tu meta de " + format(inputs.goal) + " en " + describeMonths(months) + ".";
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
  const inputs = readInputs();

  if (inputs.error) {
    errorBox.textContent = inputs.error;
    errorBox.hidden = false;
    results.hidden = true;
    return;
  }

  errorBox.hidden = true;
  results.hidden = false;

  const rows = simulate(inputs);
  const last = rows[rows.length - 1];

  document.getElementById("final-balance").textContent = format(last.balance);
  document.getElementById("final-contributed").textContent = format(last.contributed);
  document.getElementById("final-interest").textContent = format(last.interest);

  renderGoal(inputs);
  renderTable(rows);
}

form.addEventListener("input", render);
// Results update as you type; the button is for keyboard users and pressing Enter.
// preventDefault stops the browser from reloading the page on submit.
form.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});
render();
