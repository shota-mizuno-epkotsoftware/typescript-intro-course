import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCategories } from "./categories.ts";

test("parseCategories は categories の配列をそのまま返す（すべて正しい分類のとき）", () => {
  assert.deepEqual(parseCategories({ categories: ["食費", "交通費"] }), ["食費", "交通費"]);
});

test("parseCategories は文字列でないものを除く", () => {
  assert.deepEqual(parseCategories({ categories: ["食費", 100, "交通費", null] }), ["食費", "交通費"]);
  assert.deepEqual(parseCategories({ categories: [true, "食費", 0, { name: "娯楽" }, ["交通費"]] }), ["食費"]);
});

test("parseCategories は空の文字列を除く", () => {
  assert.deepEqual(parseCategories({ categories: ["食費", "", "交通費"] }), ["食費", "交通費"]);
});

test("parseCategories は、同じ分類が 2 回出てきたら、2 回目を除く", () => {
  assert.deepEqual(parseCategories({ categories: ["食費", "交通費", "食費", "娯楽"] }), ["食費", "交通費", "娯楽"]);
});

test("parseCategories は、形が違うデータならエラーを投げる", () => {
  for (const data of [null, "食費", ["食費"], { items: ["食費"] }, { categories: "食費" }]) {
    assert.throws(() => parseCategories(data), /分類のデータの形が正しくありません/);
  }
});
