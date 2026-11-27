import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderHtml, renderLines } from "../test-render.ts";
import type { CategoriesState, EntryKind } from "../types.ts";

const { EntryForm } = await loadModule<typeof import("./EntryForm.tsx")>("components/EntryForm.tsx");

function formHtml(kind: EntryKind, categories: CategoriesState, errors: string[] = []): string {
  return renderHtml(EntryForm, {
    kind,
    categories,
    errors,
    onKindChange: () => {},
    onAdd: () => {},
    onErrors: () => {},
  });
}

test("EntryForm は支出のとき、分類の欄とメモの欄の間に、固定費のチェック欄を表示する", () => {
  const lines = renderLines(EntryForm, {
    kind: "expense",
    categories: { status: "ready", items: ["食費", "交通費"] },
    errors: [],
    onKindChange: () => {},
    onAdd: () => {},
    onErrors: () => {},
  });
  const expected = [
    "<form>",
    "<label>種別<select>",
    '<option value="expense" selected="">支出</option>',
    '<option value="income">収入</option>',
    "</select>",
    "</label>",
    '<label>日付<input type="date" value=""/>',
    "</label>",
    '<label>金額<input inputMode="numeric" autoComplete="off" value=""/>',
    "</label>",
    "<label>分類<select>",
    '<option value="食費" selected="">食費</option>',
    '<option value="交通費">交通費</option>',
    "</select>",
    "</label>",
    '<label>固定費<input type="checkbox"/>',
    "</label>",
    '<label>メモ<input autoComplete="off" value=""/>',
    "</label>",
    "<button>追加</button>",
    "</form>",
    '<p class="status">',
    "</p>",
    '<ul class="errors">',
    "</ul>",
  ];
  assert.deepEqual(lines, expected);
});

test("EntryForm は収入のとき、固定費のチェック欄を表示しない", () => {
  const html = formHtml("income", { status: "ready", items: ["食費", "交通費"] });
  assert.doesNotMatch(html, /固定費/);
});

test("EntryForm は支出のとき分類の欄を表示し、入金元の欄を表示しない", () => {
  const html = formHtml("expense", { status: "ready", items: ["食費", "交通費"] });
  assert.match(html, /<label>分類<select><option value="食費" selected="">食費<\/option><option value="交通費">交通費<\/option><\/select><\/label>/);
  assert.doesNotMatch(html, /入金元/);
});

test("EntryForm は収入のとき入金元の欄を表示し、分類の欄を表示しない", () => {
  const html = formHtml("income", { status: "ready", items: ["食費", "交通費"] });
  assert.match(html, /<label>入金元<input autoComplete="off" value=""\/><\/label>/);
  assert.doesNotMatch(html, /分類/);
});

test("EntryForm は分類の読み込み中と失敗を、フォームの下に表示する", () => {
  assert.match(formHtml("expense", { status: "loading" }), /<p class="status">分類を読み込んでいます…<\/p>/);
  assert.match(
    formHtml("expense", { status: "error", message: "分類を読み込めませんでした。" }),
    /<p class="status error">分類を読み込めませんでした。<\/p>/,
  );
  assert.match(formHtml("expense", { status: "ready", items: ["食費"] }), /<p class="status"><\/p>/);
});

test("EntryForm は入力の間違いを一覧で表示する", () => {
  const html = formHtml("expense", { status: "loading" }, ["日付を入力してください", "分類を選んでください"]);
  assert.match(html, /<ul class="errors"><li>日付を入力してください<\/li><li>分類を選んでください<\/li><\/ul>/);
});
