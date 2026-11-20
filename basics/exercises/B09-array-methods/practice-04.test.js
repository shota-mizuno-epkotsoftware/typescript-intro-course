import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { amountOn } = await t.load("amountOn");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
  { date: "2026-04-04", category: "趣味", amount: 1000 },
];
t.equal('amountOn(entries, "2026-04-02") は 500', () => amountOn(entries, "2026-04-02"), 500);
t.equal('amountOn(entries, "2026-04-04") は 1000', () => amountOn(entries, "2026-04-04"), 1000);
t.equal('記録のない日付（"2026-04-09"）は 0', () => amountOn(entries, "2026-04-09"), 0);
t.uses("find を使う", /\.find\(/, "この演習では、記録を探す所で find を使ってください（9.4）。");
t.done();
