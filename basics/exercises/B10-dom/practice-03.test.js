import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { addAmount } = await t.load("addAmount");
t.equal('addAmount(1000, "500") は 1500', () => addAmount(1000, "500"), 1500);
t.equal('addAmount(0, "1200") は 1200', () => addAmount(0, "1200"), 1200);
t.equal('addAmount(1000, "abc") は 1000', () => addAmount(1000, "abc"), 1000);
t.equal('addAmount(1000, "") は 1000', () => addAmount(1000, ""), 1000);
t.equal('addAmount(1000, "12a") は 1000', () => addAmount(1000, "12a"), 1000);
t.done();
