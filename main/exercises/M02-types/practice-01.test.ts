import { test } from "node:test";
import assert from "node:assert/strict";
import { addShipping, formatTotal, parsePrice } from "./practice-01.ts";

test("parsePrice('1000') は文字列ではなく数値の 1000 を返す", () => {
  assert.equal(parsePrice("1000"), 1000);
});

test("addShipping(1000) は 1500 を返す", () => {
  assert.equal(addShipping(1000), 1500);
});

test("addShipping(0) は 500 を返す", () => {
  assert.equal(addShipping(0), 500);
});

test("formatTotal('1000') は '1500円' を返す", () => {
  assert.equal(formatTotal("1000"), "1500円");
});

test("formatTotal('0') は '500円' を返す", () => {
  assert.equal(formatTotal("0"), "500円");
});
