import { test } from "node:test";
import assert from "node:assert/strict";
import { countIf, makeMultiplier } from "./practice-01.ts";

test("countIf([1, 5, 10], n >= 5) は 2", () => {
  assert.equal(countIf([1, 5, 10], (n) => n >= 5), 2);
});

test("countIf は空の配列なら 0", () => {
  assert.equal(countIf([], (n) => n > 0), 0);
});

test("makeMultiplier(3) が返す関数に 4 を渡すと 12", () => {
  const triple = makeMultiplier(3);
  assert.equal(triple(4), 12);
});

test("makeMultiplier は呼ぶたびに別の関数を返す", () => {
  const double = makeMultiplier(2);
  const tenTimes = makeMultiplier(10);
  assert.equal(double(5), 10);
  assert.equal(tenTimes(5), 50);
});

test("makeMultiplier が返した関数を、countIf の条件の中で使える", () => {
  const double = makeMultiplier(2);
  assert.equal(countIf([1, 2, 3], (n) => double(n) > 3), 2);
});
