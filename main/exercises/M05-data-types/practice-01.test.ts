import { test } from "node:test";
import assert from "node:assert/strict";
import { emptyTotals, totalByCategory } from "./practice-01.ts";
import type { Category, Expense } from "./practice-01.ts";

const expenses: Expense[] = [
  { category: "food", amount: 800 },
  { category: "transport", amount: 200, memo: "電車" },
  { category: "food", amount: 500 },
];

test("emptyTotals はすべての分類が 0", () => {
  assert.deepEqual(emptyTotals(), { food: 0, transport: 0, other: 0 });
});

test("totalByCategory は分類ごとの合計を返す", () => {
  assert.deepEqual(totalByCategory(expenses), { food: 1300, transport: 200, other: 0 });
});

test("totalByCategory は支出がなければすべて 0", () => {
  assert.deepEqual(totalByCategory([]), { food: 0, transport: 0, other: 0 });
});

// 型の確認（npm run typecheck で確かめます）
// Category に "other" は入るはず
const other: Category = "other";

// Category に "travel" は入らないはず
// @ts-expect-error
const wrong: Category = "travel";
