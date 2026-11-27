import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderHtml, renderLines } from "../test-render.ts";
import { sampleEntries } from "../testdata.ts";

const { Summary } = await loadModule<typeof import("./Summary.tsx")>("components/Summary.tsx");

test("Summary は収入・支出・収支と、分類ごとの支出を表示する", () => {
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
  ];
  assert.deepEqual(renderLines(Summary, { entries: sampleEntries }), expected);
});

test("Summary は収支がマイナスのとき、negative のクラスを付ける", () => {
  const expenses = sampleEntries.filter((entry) => entry.kind === "expense");
  const html = renderHtml(Summary, { entries: expenses });
  assert.match(html, /<dd class="negative">-2,500円<\/dd>/);
});
