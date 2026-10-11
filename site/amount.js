// Parsing and formatting of money amounts typed by the user (Chilean format: 1.000.000).
// Amounts are whole numbers, so any non-digit character is ignored.

const groupFormat = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });

// "1.000.000" -> 1000000. Returns NaN when there are no digits.
export function parseAmount(text) {
  const digits = text.replace(/\D/g, "");
  if (digits === "") {
    return NaN;
  }
  return Number(digits);
}

// 1000000 -> "1.000.000"
export function formatAmount(value) {
  return groupFormat.format(value);
}

// Counts the digits in text before the given position. Used to keep the cursor
// in the same place after reformatting what the user typed.
export function digitsBefore(text, position) {
  return text.slice(0, position).replace(/\D/g, "").length;
}

// Returns the position in text right after the n-th digit.
export function positionAfterDigits(text, digitCount) {
  if (digitCount === 0) {
    return 0;
  }
  let seen = 0;
  for (let i = 0; i < text.length; i++) {
    if (/\d/.test(text[i])) {
      seen++;
      if (seen === digitCount) {
        return i + 1;
      }
    }
  }
  return text.length;
}
