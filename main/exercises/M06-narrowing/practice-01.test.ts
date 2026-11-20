import { test } from "node:test";
import assert from "node:assert/strict";
import { formatEntry, parseAmount } from "./practice-01.ts";

test("formatEntry は収入を「+金額 入金元」にする", () => {
  assert.equal(formatEntry({ kind: "income", amount: 1000, source: "給料" }), "+1000 給料");
});

test("formatEntry は支出を「-金額 分類」にする", () => {
  assert.equal(formatEntry({ kind: "expense", amount: 800, category: "食費" }), "-800 食費");
});

test("parseAmount は数字の文字列を数値にする", () => {
  assert.equal(parseAmount("800"), 800);
});

test("parseAmount は数値にできない文字列なら null", () => {
  assert.equal(parseAmount("abc"), null);
});

test("parseAmount は文字列でなければ null", () => {
  assert.equal(parseAmount(null), null);
  assert.equal(parseAmount([800]), null);
});
