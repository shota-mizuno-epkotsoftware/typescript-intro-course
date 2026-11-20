import { test } from "node:test";
import assert from "node:assert/strict";
import { double } from "./practice-01.ts";

test("double(3) は 6 を返す", () => {
  assert.equal(double(3), 6);
});

test("double(0) は 0 を返す", () => {
  assert.equal(double(0), 0);
});

test("double(-2.5) は -5 を返す", () => {
  assert.equal(double(-2.5), -5);
});
