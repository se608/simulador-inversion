import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAmount, formatAmount, digitsBefore, positionAfterDigits } from "../site/amount.js";

test("formats with dots as thousands separator", () => {
  assert.equal(formatAmount(1000000), "1.000.000");
  assert.equal(formatAmount(999), "999");
  assert.equal(formatAmount(0), "0");
});

test("parses formatted and unformatted amounts", () => {
  assert.equal(parseAmount("1.000.000"), 1000000);
  assert.equal(parseAmount("1000000"), 1000000);
  assert.equal(parseAmount("$ 50.000"), 50000);
});

test("empty or non-numeric input parses as NaN", () => {
  assert.ok(Number.isNaN(parseAmount("")));
  assert.ok(Number.isNaN(parseAmount("abc")));
});

test("cursor stays after the same digit when dots are added", () => {
  // User typed "10000|" (cursor at end) -> becomes "10.000", cursor still at end.
  const before = "10000";
  const after = formatAmount(parseAmount(before));
  const position = positionAfterDigits(after, digitsBefore(before, 5));
  assert.equal(position, after.length);
});

test("cursor in the middle maps to the same digit", () => {
  // "1.00|0.000": 3 digits before the cursor.
  assert.equal(digitsBefore("1.000.000", 4), 3);
  assert.equal(positionAfterDigits("1.000.000", 3), 4);
  assert.equal(positionAfterDigits("1.000.000", 0), 0);
});
