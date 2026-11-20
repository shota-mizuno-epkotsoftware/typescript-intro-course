import { test } from "node:test";
import assert from "node:assert/strict";
import { formatCount } from "./format.ts";

test("formatCount は件数を「3 件」の形にする", () => {
  assert.equal(formatCount(3), "3 件");
  assert.equal(formatCount(0), "0 件");
});
