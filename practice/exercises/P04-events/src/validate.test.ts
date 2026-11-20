import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAmount, parseEntryForm } from "./validate.ts";
import type { FormInput } from "./validate.ts";

const expenseInput: FormInput = {
  kind: "expense",
  date: "2026-11-10",
  amount: "800",
  category: "食費",
  source: "",
  memo: " 昼食 ",
};

test("parseAmount は 1 以上の整数だけを数値にする", () => {
  assert.equal(parseAmount("800"), 800);
  for (const text of ["", "0", "-100", "1.5", "abc"]) {
    assert.equal(parseAmount(text), null, `金額 "${text}"`);
  }
});

test("parseEntryForm は支出の入力から支出の明細を作る", () => {
  assert.deepEqual(parseEntryForm(expenseInput, "id-1"), {
    ok: true,
    entry: { kind: "expense", id: "id-1", date: "2026-11-10", amount: 800, category: "食費", memo: "昼食" },
  });
});

test("parseEntryForm は収入の入力から収入の明細を作る（メモが空なら memo を持たない）", () => {
  const input: FormInput = { ...expenseInput, kind: "income", source: "給料", amount: "200000", memo: "" };
  assert.deepEqual(parseEntryForm(input, "id-2"), {
    ok: true,
    entry: { kind: "income", id: "id-2", date: "2026-11-10", amount: 200000, source: "給料" },
  });
});

test("parseEntryForm は正しくない入力を、すべてメッセージで返す", () => {
  const input: FormInput = { ...expenseInput, date: "", amount: "abc", category: "" };
  assert.deepEqual(parseEntryForm(input, "id-3"), {
    ok: false,
    errors: ["日付を入力してください", "金額は 1 以上の整数で入力してください", "分類を選んでください"],
  });
});

test("parseEntryForm は種別が収入でも支出でもなければメッセージを返す", () => {
  const input: FormInput = { ...expenseInput, kind: "" };
  assert.deepEqual(parseEntryForm(input, "id-5"), { ok: false, errors: ["種別を選んでください"] });
});

test("parseEntryForm は収入で入金元が空ならメッセージを返す", () => {
  const input: FormInput = { ...expenseInput, kind: "income", source: "  " };
  assert.deepEqual(parseEntryForm(input, "id-4"), { ok: false, errors: ["入金元を入力してください"] });
});
