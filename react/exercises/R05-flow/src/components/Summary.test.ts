import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderHtml, renderLines } from "../test-render.ts";
import { sampleEntries } from "../testdata.ts";

const { Summary } = await loadModule<typeof import("./Summary.tsx")>("components/Summary.tsx");

test("Summary は収入・支出・収支と、分類ごとの支出、入金元ごとの収入を表示する", () => {
  const expected = [
    '<dl class="totals">',
    "<dt>収入</dt>",
    "<dd>200,000円</dd>",
    "<dt>支出</dt>",
    "<dd>2,500円</dd>",
    "<dt>収支</dt>",
    '<dd class="positive">197,500円</dd>',
    "</dl>",
    "<h3>分類ごとの支出</h3>",
    '<ul class="plain-list">',
    "<li>食費: 1,300円</li>",
    "<li>交通費: 1,200円</li>",
    "</ul>",
    "<h3>入金元ごとの収入</h3>",
    '<ul class="plain-list">',
    "<li>給料: 200,000円</li>",
    "</ul>",
  ];
  assert.deepEqual(renderLines(Summary, { entries: sampleEntries }), expected);
});

test("Summary は収支がマイナスのとき、negative のクラスを付ける", () => {
  const expenses = sampleEntries.filter((entry) => entry.kind === "expense");
  const html = renderHtml(Summary, { entries: expenses });
  assert.match(html, /<dd class="negative">-2,500円<\/dd>/);
});

test("Summary は入金元ごとの収入を、金額の大きい順に並べる", () => {
  const lines = renderLines(Summary, {
    entries: [
      { kind: "income", id: "x", date: "2026-11-10", amount: 30000, source: "副業" },
      { kind: "income", id: "y", date: "2026-11-25", amount: 180000, source: "給料" },
    ],
  });
  assert.deepEqual(lines.slice(-5), [
    "<h3>入金元ごとの収入</h3>",
    '<ul class="plain-list">',
    "<li>給料: 180,000円</li>",
    "<li>副業: 30,000円</li>",
    "</ul>",
  ]);
});

test("Summary は収入が 1 件もないとき、入金元ごとの収入の見出しを表示しない", () => {
  const expenses = sampleEntries.filter((entry) => entry.kind === "expense");
  const expected = [
    '<dl class="totals">',
    "<dt>収入</dt>",
    "<dd>0円</dd>",
    "<dt>支出</dt>",
    "<dd>2,500円</dd>",
    "<dt>収支</dt>",
    '<dd class="negative">-2,500円</dd>',
    "</dl>",
    "<h3>分類ごとの支出</h3>",
    '<ul class="plain-list">',
    "<li>食費: 1,300円</li>",
    "<li>交通費: 1,200円</li>",
    "</ul>",
  ];
  assert.deepEqual(renderLines(Summary, { entries: expenses }), expected);
});
