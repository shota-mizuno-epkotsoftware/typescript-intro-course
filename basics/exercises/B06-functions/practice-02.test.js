import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { withTax } = await t.load("withTax");
t.equal("withTax(800, 10) は 880", () => withTax(800, 10), 880);
t.equal("withTax(1500, 8) は 1620", () => withTax(1500, 8), 1620);
t.equal("withTax(0, 10) は 0", () => withTax(0, 10), 0);
t.done();
