import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCategories } from "./categories.ts";

test("parseCategories は categories の配列から文字列だけを取り出す", () => {
  assert.deepEqual(parseCategories({ categories: ["食費", 100, "交通費", null] }), ["食費", "交通費"]);
});

test("parseCategories は、形が違うデータならエラーを投げる", () => {
  for (const data of [null, "食費", ["食費"], { items: ["食費"] }, { categories: "食費" }]) {
    assert.throws(() => parseCategories(data), /分類のデータの形が正しくありません/);
  }
});
