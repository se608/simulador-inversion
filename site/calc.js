// Pure calculation logic. No DOM here, so it can be tested with Node.

// Converts an annual return (e.g. 0.07 for 7%) into the equivalent monthly return,
// so that 12 months of monthly compounding give exactly the annual return.
export function monthlyRate(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

// Simulates month by month. Contributions are added at the end of each month.
// Returns one row per year with the balance and how much of it was contributed.
export function simulate({ initial, monthly, annualRate, years }) {
  const rate = monthlyRate(annualRate);
  let balance = initial;
  let contributed = initial;
  const rows = [];

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + rate) + monthly;
      contributed = contributed + monthly;
    }
    rows.push({
      year: year,
      balance: balance,
      contributed: contributed,
      interest: balance - contributed,
    });
  }

  return rows;
}

// Returns the number of months needed to reach the goal, or null if it is not
// reached within maxYears.
export function monthsToGoal({ initial, monthly, annualRate, goal, maxYears = 100 }) {
  const rate = monthlyRate(annualRate);
  let balance = initial;

  if (balance >= goal) {
    return 0;
  }

  for (let month = 1; month <= maxYears * 12; month++) {
    balance = balance * (1 + rate) + monthly;
    if (balance >= goal) {
      return month;
    }
  }

  return null;
}
