import { test } from "node:test";
import assert from "node:assert/strict";
import { balanceOf, filterEntries, listMonths, sortByDate, totalOf, totalsByCategory } from "./summary.ts";
import { sampleEntries } from "./testdata.ts";

test("listMonths は明細のある月を、新しい順に重複なく返す", () => {
  assert.deepEqual(listMonths(sampleEntries), ["2026-11", "2026-10"]);
});

test("filterEntries は月と種別で絞り込む", () => {
  const ids = (month: string, kind: "all" | "income" | "expense") =>
    filterEntries(sampleEntries, { month, kind, keyword: "" }).map((entry) => entry.id);
  assert.deepEqual(ids("all", "all"), ["a", "b", "c", "d"]);
  assert.deepEqual(ids("2026-10", "all"), ["a", "b"]);
  assert.deepEqual(ids("all", "expense"), ["b", "c", "d"]);
  assert.deepEqual(ids("2026-11", "income"), []);
});

const search = (keyword: string) =>
  filterEntries(sampleEntries, { month: "all", kind: "all", keyword }).map((entry) => entry.id);

test("filterEntries は、検索語がメモに含まれる明細だけを残す", () => {
  assert.deepEqual(search("昼"), ["b"]);
  assert.deepEqual(search("夕食"), []);
});

test("filterEntries は、検索語が分類か入金元に含まれる明細も残す", () => {
  assert.deepEqual(search("食"), ["b", "d"]);
  assert.deepEqual(search("給料"), ["a"]);
});

test("filterEntries は、メモ・分類・入金元のほかの項目（種別や日付など）は調べない", () => {
  assert.deepEqual(search("expense"), []);
  assert.deepEqual(search("2026"), []);
});

test("filterEntries は、月・種別・検索語のすべてに合う明細だけを残す", () => {
  const ids = filterEntries(sampleEntries, { month: "2026-11", kind: "expense", keyword: "食費" }).map((entry) => entry.id);
  assert.deepEqual(ids, ["d"]);
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
