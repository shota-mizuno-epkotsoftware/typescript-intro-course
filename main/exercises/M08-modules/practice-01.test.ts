import { test } from "node:test";
import assert from "node:assert/strict";
import { applyChanges, describeItem, totalByName } from "./practice-01.ts";

test("describeItem は「商品名: 税込価格」を返す", () => {
  assert.equal(describeItem({ name: "ノート", price: 120 }), "ノート: 132円");
});

test("applyChanges は changes の内容で上書きした新しいオブジェクトを返す", () => {
  assert.deepEqual(applyChanges({ name: "ノート", price: 120 }, { price: 100 }), { name: "ノート", price: 100 });
});

test("applyChanges は changes が空なら同じ内容を返す", () => {
  assert.deepEqual(applyChanges({ name: "ペン", price: 80 }, {}), { name: "ペン", price: 80 });
});

test("applyChanges は元のオブジェクトを変えない", () => {
  const item = { name: "ノート", price: 120 };
  applyChanges(item, { name: "大学ノート" });
  assert.deepEqual(item, { name: "ノート", price: 120 });
});

test("totalByName は同じ名前の価格を合計する", () => {
  const items = [
    { name: "ノート", price: 120 },
    { name: "ペン", price: 80 },
    { name: "ノート", price: 100 },
  ];
  assert.equal(totalByName(items).get("ノート"), 220);
  assert.equal(totalByName(items).get("ペン"), 80);
});

test("totalByName は、ない名前には値を持たない", () => {
  assert.equal(totalByName([{ name: "ノート", price: 120 }]).get("ペン"), undefined);
});

test("totalByName は空の配列なら空の Map を返す", () => {
  assert.equal(totalByName([]).size, 0);
});
