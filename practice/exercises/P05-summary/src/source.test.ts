import { test } from "node:test";
import assert from "node:assert/strict";
import { totalsBySource } from "./summary.ts";
import type { Entry } from "./types.ts";

const entries: Entry[] = [
  { kind: "income", id: "a", date: "2026-10-25", amount: 200000, source: "給料" },
  { kind: "income", id: "b", date: "2026-11-10", amount: 30000, source: "副業" },
  { kind: "expense", id: "c", date: "2026-11-12", amount: 1200, category: "交通費" },
  { kind: "income", id: "d", date: "2026-11-25", amount: 180000, source: "給料" },
  { kind: "income", id: "e", date: "2026-11-28", amount: 50000, source: "臨時収入" },
];

test("totalsBySource は収入を入金元ごとに合計し、金額の大きい順に返す", () => {
  assert.deepEqual(totalsBySource(entries), [
    { source: "給料", total: 380000 },
    { source: "臨時収入", total: 50000 },
    { source: "副業", total: 30000 },
  ]);
});

test("totalsBySource は、収入がなければ空の配列を返す", () => {
  assert.deepEqual(totalsBySource([]), []);
  assert.deepEqual(totalsBySource([{ kind: "expense", id: "c", date: "2026-11-12", amount: 1200, category: "交通費" }]), []);
});
