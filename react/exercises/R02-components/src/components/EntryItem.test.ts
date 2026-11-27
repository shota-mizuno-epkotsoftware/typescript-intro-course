import { test } from "node:test";
import assert from "node:assert/strict";
import { loadModule, renderHtml } from "../test-render.ts";
import type { Entry } from "../types.ts";

const { EntryItem } = await loadModule<typeof import("./EntryItem.tsx")>("components/EntryItem.tsx");

const expense = (amount: number): Entry => ({ kind: "expense", id: "x", date: "2026-11-01", amount, category: "食費" });
const income: Entry = { kind: "income", id: "y", date: "2026-11-01", amount: 200000, source: "給料" };
const itemHtml = (entry: Entry) => renderHtml(EntryItem, { entry, onRemove: () => {} });

test("EntryItem は 10,000 円以上の支出の行に large のクラスを付ける", () => {
  assert.match(itemHtml(expense(10000)), /^<li class="large">/);
  assert.match(itemHtml(expense(25000)), /^<li class="large">/);
});

test("EntryItem は、10,000 円未満の支出と収入の行に large のクラスを付けない", () => {
  assert.doesNotMatch(itemHtml(expense(9999)), /large/);
  assert.doesNotMatch(itemHtml(income), /large/);
});
