import { test } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { reportFile, sumFile } from "./practice-01.ts";

const numbersPath = join(import.meta.dirname, "numbers.txt");
const pricesPath = join(import.meta.dirname, "prices.txt");
const missingPath = join(import.meta.dirname, "missing.txt");

test("sumFile は numbers.txt の合計 600 を返す", async () => {
  assert.equal(await sumFile(numbersPath), 600);
});

test("sumFile は prices.txt の合計 120 を返す", async () => {
  assert.equal(await sumFile(pricesPath), 120);
});

test("reportFile は成功したら「合計: 600」", async () => {
  assert.equal(await reportFile(numbersPath), "合計: 600");
});

test("reportFile はファイルがなければ「読み込めません: ENOENT...」", async () => {
  const result = await reportFile(missingPath);
  assert.ok(result.startsWith("読み込めません: ENOENT"), result);
});
