import { test } from "node:test";
import assert from "node:assert/strict";
import { addTag, withCity, withPrice } from "./practice-01.ts";

test("addTag は末尾にタグを足した新しい配列を返す", () => {
  assert.deepEqual(addTag(["文具"], "セール"), ["文具", "セール"]);
});

test("addTag は元の配列を変えない", () => {
  const tags = ["文具"];
  addTag(tags, "セール");
  assert.deepEqual(tags, ["文具"]);
});

test("withPrice は価格を変えた新しいオブジェクトを返す", () => {
  const item = { name: "ノート", price: 120 };
  assert.deepEqual(withPrice(item, 150), { name: "ノート", price: 150 });
});

test("withPrice は元のオブジェクトを変えない", () => {
  const item = { name: "ノート", price: 120 };
  const result = withPrice(item, 150);
  assert.deepEqual(item, { name: "ノート", price: 120 });
  assert.notEqual(result, item);
});

test("withCity は city だけを変えた新しいオブジェクトを返す", () => {
  const user = { name: "Alice", address: { city: "東京", zip: "100-0001" } };
  assert.deepEqual(withCity(user, "大阪"), { name: "Alice", address: { city: "大阪", zip: "100-0001" } });
});

test("withCity は元の address を変えない", () => {
  const user = { name: "Alice", address: { city: "東京", zip: "100-0001" } };
  const result = withCity(user, "大阪");
  assert.deepEqual(user.address, { city: "東京", zip: "100-0001" });
  assert.notEqual(result.address, user.address);
});
