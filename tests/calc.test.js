import { test } from "node:test";
import assert from "node:assert/strict";
import { monthlyRate, simulate, monthsToGoal } from "../site/calc.js";

test("12 monthly periods compound back to the annual rate", () => {
  const rate = monthlyRate(0.07);
  assert.ok(Math.abs(Math.pow(1 + rate, 12) - 1.07) < 1e-12);
});

test("with no contributions, balance grows exactly by the annual rate", () => {
  const rows = simulate({ initial: 1000, monthly: 0, annualRate: 0.1, years: 2 });
  assert.ok(Math.abs(rows[0].balance - 1100) < 1e-9);
  assert.ok(Math.abs(rows[1].balance - 1210) < 1e-9);
});

test("with 0% return, balance equals total contributed", () => {
  const rows = simulate({ initial: 500, monthly: 100, annualRate: 0, years: 3 });
  const last = rows[rows.length - 1];
  assert.equal(last.balance, 500 + 100 * 36);
  assert.equal(last.interest, 0);
});

test("matches the closed-form future value formula", () => {
  const annualRate = 0.06;
  const r = monthlyRate(annualRate);
  const n = 10 * 12;
  const expected = 2000 * Math.pow(1 + r, n) + (300 * (Math.pow(1 + r, n) - 1)) / r;
  const rows = simulate({ initial: 2000, monthly: 300, annualRate: annualRate, years: 10 });
  assert.ok(Math.abs(rows[9].balance - expected) < 1e-6);
});

test("monthsToGoal returns 0 when the goal is already met", () => {
  assert.equal(monthsToGoal({ initial: 100, monthly: 0, annualRate: 0, goal: 50 }), 0);
});

test("monthsToGoal counts months with 0% return", () => {
  assert.equal(monthsToGoal({ initial: 0, monthly: 100, annualRate: 0, goal: 1000 }), 10);
});

test("monthsToGoal returns null when the goal is unreachable", () => {
  assert.equal(monthsToGoal({ initial: 0, monthly: 0, annualRate: 0.05, goal: 1000 }), null);
});
