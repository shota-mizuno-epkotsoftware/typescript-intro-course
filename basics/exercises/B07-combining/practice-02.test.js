import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { double, withTax, larger, half } = await t.load("double", "withTax", "larger", "half");
t.equal("double(5) は 10", () => double(5), 10);
t.equal("double(3) は 6", () => double(3), 6);
t.equal("withTax(800, 10) は 880", () => withTax(800, 10), 880);
t.equal("withTax(1500, 8) は 1620", () => withTax(1500, 8), 1620);
t.equal("larger(3, 7) は 7", () => larger(3, 7), 7);
t.equal("larger(7, 3) は 7", () => larger(7, 3), 7);
t.equal("larger(5, 2) は 5", () => larger(5, 2), 5);
t.equal("half(10) は 5", () => half(10), 5);
t.equal("half(8) は 4", () => half(8), 4);
t.uses("half をアロー関数で書く", /exportconsthalf=\(?\w+\)?=>/, "half を、export const half = (n) => ... の形のアロー関数に書き換えてください。");
t.done();
