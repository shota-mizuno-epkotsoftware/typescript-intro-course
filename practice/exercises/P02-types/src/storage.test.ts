import { test } from "node:test";
import assert from "node:assert/strict";
import { parseStoredEntries } from "./storage.ts";
import { sampleEntries } from "./testdata.ts";

test("parseStoredEntries は保存した明細をそのまま読み戻す", () => {
  assert.deepEqual(parseStoredEntries(JSON.stringify(sampleEntries)), sampleEntries);
});

test("parseStoredEntries は、fixed のない支出（項目を足す前に保存したデータ）を、fixed が false の支出として読む", () => {
  const stored = JSON.stringify([{ kind: "expense", id: "x", date: "2026-11-01", amount: 800, category: "食費" }]);
  assert.deepEqual(parseStoredEntries(stored), [
    { kind: "expense", id: "x", date: "2026-11-01", amount: 800, category: "食費", fixed: false },
  ]);
});

test("parseStoredEntries は、fixed が true でも false でもない支出を、fixed が false の支出として読む", () => {
  const stored = JSON.stringify([{ kind: "expense", id: "x", date: "2026-11-01", amount: 800, category: "食費", fixed: "no" }]);
  assert.deepEqual(parseStoredEntries(stored), [
    { kind: "expense", id: "x", date: "2026-11-01", amount: 800, category: "食費", fixed: false },
  ]);
});

test("parseStoredEntries は、保存がない・JSON でない・配列でないときは空の配列を返す", () => {
  assert.deepEqual(parseStoredEntries(null), []);
  assert.deepEqual(parseStoredEntries("{壊れたデータ"), []);
  assert.deepEqual(parseStoredEntries('{"entries": []}'), []);
});

test("parseStoredEntries は、形の正しくない明細だけを捨てる", () => {
  const stored = JSON.stringify([
    sampleEntries[0],
    { kind: "expense", id: "x", date: "2026-11-01", amount: "800", category: "食費", fixed: false },
    { kind: "expense", id: "y", date: "11/01", amount: 800, category: "食費", fixed: false },
    { kind: "income", id: "z", date: "2026-11-01", amount: 800 },
    "明細ではない",
    null,
  ]);
  assert.deepEqual(parseStoredEntries(stored), [sampleEntries[0]]);
});
