import { test } from "node:test";
import assert from "node:assert/strict";
import { addEntry, createInitialState, removeEntry, setFilter, setFormErrors, setFormKind } from "./state.ts";
import { sampleEntries } from "./testdata.ts";
import type { Entry } from "./types.ts";

const newEntry: Entry = { kind: "expense", id: "e", date: "2026-11-10", amount: 300, category: "日用品" };

test("createInitialState は、絞り込みなし・分類は読み込み中で始まる", () => {
  assert.deepEqual(createInitialState([]), {
    entries: [],
    filter: { month: "all", kind: "all" },
    categories: { status: "loading" },
    formKind: "expense",
    formErrors: [],
  });
});

test("addEntry は明細を足した新しい状態を返し、入力エラーを消す", () => {
  const before = setFormErrors(createInitialState(sampleEntries), ["日付を入力してください"]);
  const after = addEntry(before, newEntry);
  assert.equal(after.entries.length, 5);
  assert.deepEqual(after.formErrors, []);
  assert.equal(before.entries.length, 4);
  assert.notEqual(after.entries, before.entries);
});

test("removeEntry は id が一致する明細だけを除く", () => {
  const after = removeEntry(createInitialState([...sampleEntries]), "b");
  assert.deepEqual(after.entries.map((entry) => entry.id), ["a", "c", "d"]);
});

test("removeEntry は、受け取った状態を変えず、新しい状態を返す", () => {
  const before = createInitialState([...sampleEntries]);
  const after = removeEntry(before, "b");
  assert.deepEqual(before.entries.map((entry) => entry.id), ["a", "b", "c", "d"]);
  assert.notEqual(after, before);
  assert.notEqual(after.entries, before.entries);
});

test("removeEntry は、絞り込み中の月の明細がなくなったら、月の絞り込みを外す", () => {
  const filtered = setFilter(createInitialState([...sampleEntries]), { month: "2026-10", kind: "expense" });
  const stillThere = removeEntry(filtered, "b");
  assert.equal(stillThere.filter.month, "2026-10");
  const gone = removeEntry(stillThere, "a");
  assert.equal(gone.filter.month, "all");
  assert.equal(gone.filter.kind, "expense");
  assert.equal(filtered.filter.month, "2026-10");
});

test("setFilter は指定した項目だけを変える", () => {
  const state = setFilter(createInitialState([]), { kind: "expense" });
  assert.deepEqual(state.filter, { month: "all", kind: "expense" });
});

test("setFormKind はフォームの種別を変え、入力エラーを消す", () => {
  const before = setFormErrors(createInitialState([]), ["分類を選んでください"]);
  const after = setFormKind(before, "income");
  assert.equal(after.formKind, "income");
  assert.deepEqual(after.formErrors, []);
});
