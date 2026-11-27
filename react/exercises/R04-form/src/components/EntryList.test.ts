import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderHtml, renderLines } from "../test-render.ts";
import { sampleEntries } from "../testdata.ts";

const { EntryList } = await loadModule<typeof import("./EntryList.tsx")>("components/EntryList.tsx");

const onRemove = () => {};

test("EntryList は明細を日付の新しい順に並べ、メモがあれば表示する", () => {
  const entries = sampleEntries.filter((entry) => entry.id === "a" || entry.id === "b");
  const expected = [
    '<ul class="entries">',
    "<li>",
    '<span class="date">2026-10-28</span>',
    "<span>",
    '<span class="label">食費</span>',
    '<span class="memo"> 昼食</span>',
    "</span>",
    '<span class="amount amount-expense">-800円</span>',
    '<button class="remove">削除</button>',
    "</li>",
    "<li>",
    '<span class="date">2026-10-25</span>',
    "<span>",
    '<span class="label">給料</span>',
    "</span>",
    '<span class="amount amount-income">+200,000円</span>',
    '<button class="remove">削除</button>',
    "</li>",
    "</ul>",
  ];
  assert.deepEqual(renderLines(EntryList, { entries, onRemove }), expected);
});

test("EntryList は明細がないとき、そのことを知らせる文を表示する", () => {
  const expected = ['<ul class="entries">', "</ul>", '<p class="status">明細はまだありません。</p>'];
  assert.deepEqual(renderLines(EntryList, { entries: [], onRemove }), expected);
});

test("EntryList はメモに書いたタグを、文字のまま表示する", () => {
  const html = renderHtml(EntryList, {
    entries: [{ kind: "expense", id: "x", date: "2026-11-05", amount: 500, category: "食費", fixed: false, memo: "<b>昼食</b>" }],
    onRemove,
  });
  assert.match(html, /<span class="memo"> &lt;b&gt;昼食&lt;\/b&gt;<\/span>/);
});
