import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMemos, removeMemo } from "./practice-01.ts";

test("parseMemos は保存がないとき空の配列を返す", () => {
  assert.deepEqual(parseMemos(null), []);
});

test("parseMemos は JSON の文字列をメモの配列にする", () => {
  assert.deepEqual(parseMemos('[{"id":"1","text":"milk"}]'), [{ id: "1", text: "milk" }]);
});

test("removeMemo は指定した id のメモを除く", () => {
  const memos = [{ id: "1", text: "milk" }, { id: "2", text: "egg" }];
  assert.deepEqual(removeMemo(memos, "1"), [{ id: "2", text: "egg" }]);
});

test("removeMemo は元の配列を変えない", () => {
  const memos = [{ id: "1", text: "milk" }];
  removeMemo(memos, "1");
  assert.equal(memos.length, 1);
});
