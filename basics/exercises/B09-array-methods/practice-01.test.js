import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { amountsOf, expensive } = await t.load("amountsOf", "expensive");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
  { date: "2026-04-04", category: "趣味", amount: 1000 },
];
t.equal("amountsOf(entries) は、金額の配列", () => amountsOf(entries), [1200, 500, 800, 1000]);
t.equal("amountsOf([]) は、空の配列", () => amountsOf([]), []);
t.equal("expensive(entries) は、1000 円以上の 2 件", () => expensive(entries), [entries[0], entries[3]]);
t.done();
