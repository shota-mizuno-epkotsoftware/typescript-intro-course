import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderHtml } from "./test-render.ts";
import { sampleEntries } from "./testdata.ts";

const { App } = await loadModule<typeof import("./App.tsx")>("App.tsx");

test("App は最初、すべての明細と、その集計を表示する", () => {
  const html = renderHtml(App, { initialEntries: sampleEntries });
  assert.equal(html.match(/<li><span class="date">/g)?.length, 4);
  assert.match(html, /<dd class="positive">197,500円<\/dd>/);
  assert.match(html, /<option value="all" selected="">すべて<\/option><option value="2026-11">2026年11月<\/option>/);
});

test("App は最初、分類を読み込み中として表示する", () => {
  const html = renderHtml(App, { initialEntries: [] });
  assert.match(html, /<p class="status">分類を読み込んでいます…<\/p>/);
  assert.match(html, /<p class="status">明細はまだありません。<\/p>/);
});
