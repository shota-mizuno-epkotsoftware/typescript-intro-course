import { test } from "node:test";
import assert from "node:assert/strict";
import { formatLine, formatYen, parseExpense, sumAmounts } from "./practice-01.ts";

test("formatYen は 3 けたごとに区切って「円」を付ける", () => {
  assert.equal(formatYen(1234), "1,234円");
  assert.equal(formatYen(800), "800円");
});

test("formatLine は「昼食: 800円」の形の文字を作る", () => {
  assert.equal(formatLine({ name: "昼食", amount: 800 }), "昼食: 800円");
  assert.equal(formatLine({ name: "本", amount: 1500 }), "本: 1,500円");
});

test("sumAmounts は金額の合計を返す", () => {
  assert.equal(sumAmounts([{ name: "昼食", amount: 800 }, { name: "電車", amount: 200 }]), 1000);
  assert.equal(sumAmounts([]), 0);
});

test("parseExpense は正しい入力から支出を作る", () => {
  assert.deepEqual(parseExpense("昼食", "800"), { name: "昼食", amount: 800 });
});

test("parseExpense は名前の前後の空白を除く", () => {
  assert.deepEqual(parseExpense("  昼食 ", "800"), { name: "昼食", amount: 800 });
});

test("parseExpense は名前が空ならメッセージを返す", () => {
  assert.equal(parseExpense("   ", "800"), "名前を入力してください");
});

test("parseExpense は金額が数値でなければメッセージを返す", () => {
  assert.equal(parseExpense("昼食", "abc"), "金額は 1 以上の整数で入力してください");
});

test("parseExpense は金額が空・0・小数・マイナスならメッセージを返す", () => {
  for (const amount of ["", "0", "1.5", "-100"]) {
    assert.equal(parseExpense("昼食", amount), "金額は 1 以上の整数で入力してください", `金額 "${amount}"`);
  }
});
