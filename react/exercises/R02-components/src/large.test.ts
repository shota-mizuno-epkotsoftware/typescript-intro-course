import { test } from "node:test";
import assert from "node:assert/strict";
import { isLargeExpense } from "./format.ts";
import type { Entry } from "./types.ts";

const expense = (amount: number): Entry => ({ kind: "expense", id: "x", date: "2026-11-01", amount, category: "食費" });

test("isLargeExpense は 10,000 円以上の支出なら true を返す", () => {
  assert.equal(isLargeExpense(expense(10000)), true);
  assert.equal(isLargeExpense(expense(25000)), true);
});

test("isLargeExpense は 10,000 円未満の支出なら false を返す", () => {
  assert.equal(isLargeExpense(expense(9999)), false);
});

test("isLargeExpense は、収入なら金額にかかわらず false を返す", () => {
  assert.equal(isLargeExpense({ kind: "income", id: "y", date: "2026-11-01", amount: 200000, source: "給料" }), false);
});
