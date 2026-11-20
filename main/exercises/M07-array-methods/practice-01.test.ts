import { test } from "node:test";
import assert from "node:assert/strict";
import { changePrice, namesUnder, sortByPrice } from "./practice-01.ts";

function sample() {
  return [
    { name: "ノート", price: 120 },
    { name: "万年筆", price: 3000 },
    { name: "ペン", price: 80 },
    { name: "ファイル", price: 200 },
  ];
}

test("namesUnder(products, 150) は 150 円未満の商品の名前を返す", () => {
  assert.deepEqual(namesUnder(sample(), 150), ["ノート", "ペン"]);
});

test("namesUnder は limit ちょうどの商品を含めない", () => {
  assert.deepEqual(namesUnder(sample(), 120), ["ペン"]);
});

test("namesUnder は当てはまる商品がなければ空の配列", () => {
  assert.deepEqual(namesUnder(sample(), 10), []);
});

test("sortByPrice は価格の安い順に並べる", () => {
  assert.deepEqual(
    sortByPrice(sample()).map((p) => p.price),
    [80, 120, 200, 3000],
  );
});

test("sortByPrice は元の配列を変えない", () => {
  const products = sample();
  sortByPrice(products);
  assert.deepEqual(products, sample());
});

test("changePrice は「ペン」の価格だけを変えた新しい配列を返す", () => {
  assert.deepEqual(
    changePrice(sample(), "ペン", 100).map((p) => p.price),
    [120, 3000, 100, 200],
  );
});

test("changePrice は元の配列を変えない", () => {
  const products = sample();
  changePrice(products, "ペン", 100);
  assert.deepEqual(products, sample());
});
