import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderLines } from "../test-render.ts";
import { sampleEntries } from "../testdata.ts";

const { FilterBar } = await loadModule<typeof import("./FilterBar.tsx")>("components/FilterBar.tsx");

test("FilterBar は明細のある月を選択肢にし、絞り込みの値を選んだ状態にする", () => {
  const lines = renderLines(FilterBar, {
    entries: sampleEntries,
    filter: { month: "2026-10", kind: "expense" },
    onFilterChange: () => {},
  });
  const expected = [
    '<div class="filters">',
    "<label>月<select>",
    '<option value="all">すべて</option>',
    '<option value="2026-11">2026年11月</option>',
    '<option value="2026-10" selected="">2026年10月</option>',
    "</select>",
    "</label>",
    "<label>種別<select>",
    '<option value="all">すべて</option>',
    '<option value="income">収入</option>',
    '<option value="expense" selected="">支出</option>',
    "</select>",
    "</label>",
    "</div>",
  ];
  assert.deepEqual(lines, expected);
});
