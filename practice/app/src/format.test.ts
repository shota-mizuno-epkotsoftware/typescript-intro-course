import { test } from "node:test";
import assert from "node:assert/strict";
import { entryLabel, formatMonth, formatSignedYen, formatYen } from "./format.ts";
import { sampleEntries } from "./testdata.ts";

test("formatYen は 3 けたごとに区切って「円」を付ける", () => {
  assert.equal(formatYen(1234567), "1,234,567円");
  assert.equal(formatYen(0), "0円");
});

test("formatSignedYen は収入に +、支出に - を付ける", () => {
  assert.deepEqual(sampleEntries.slice(0, 2).map(formatSignedYen), ["+200,000円", "-800円"]);
});

test("entryLabel は収入なら入金元、支出なら分類を返す", () => {
  assert.deepEqual(sampleEntries.slice(0, 2).map(entryLabel), ["給料", "食費"]);
});

test("formatMonth は「2026年11月」の形にする", () => {
  assert.equal(formatMonth("2026-11"), "2026年11月");
  assert.equal(formatMonth("2026-01"), "2026年1月");
});
