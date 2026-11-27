import { test } from "node:test";
import assert from "node:assert/strict";
import { balanceOf, filterEntries, listMonths, sortByDate, totalOf, totalsByCategory } from "./summary.ts";
import { sampleEntries } from "./testdata.ts";

test("listMonths は明細のある月を、新しい順に重複なく返す", () => {
  assert.deepEqual(listMonths(sampleEntries), ["2026-11", "2026-10"]);
});

test("filterEntries は月と種別で絞り込む", () => {
  const ids = (month: string, kind: "all" | "income" | "expense") =>
    filterEntries(sampleEntries, { month, kind }).map((entry) => entry.id);
  assert.deepEqual(ids("all", "all"), ["a", "b", "c", "d"]);
  assert.deepEqual(ids("2026-10", "all"), ["a", "b"]);
  assert.deepEqual(ids("all", "expense"), ["b", "c", "d"]);
  assert.deepEqual(ids("2026-11", "income"), []);
});

test("sortByDate は日付の新しい順に並べ、元の配列を変えない", () => {
  const before = sampleEntries.map((entry) => entry.id);
  assert.deepEqual(sortByDate(sampleEntries).map((entry) => entry.id), ["d", "c", "b", "a"]);
  assert.deepEqual(sampleEntries.map((entry) => entry.id), before);
});

test("totalOf と balanceOf は合計と収支を返す", () => {
  assert.equal(totalOf(sampleEntries, "income"), 200000);
  assert.equal(totalOf(sampleEntries, "expense"), 2500);
  assert.equal(balanceOf(sampleEntries), 197500);
  assert.equal(balanceOf([]), 0);
});

test("totalsByCategory は支出を分類ごとに合計し、金額の大きい順に返す", () => {
  assert.deepEqual(totalsByCategory(sampleEntries), [
    { category: "食費", total: 1300 },
    { category: "交通費", total: 1200 },
  ]);
});
