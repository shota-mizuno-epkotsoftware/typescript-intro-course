import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { labels, over } = await t.load("labels", "over");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
  { date: "2026-04-04", category: "趣味", amount: 1000 },
];
t.equal("labels(entries) は、文字列の配列", () => labels(entries), ["食費: 1200円", "交通費: 500円", "食費: 800円", "趣味: 1000円"]);
t.equal("over(entries, 1000) は、1000 円以上の 2 件", () => over(entries, 1000), [entries[0], entries[3]]);
t.equal("over(entries, 5000) は、空の配列", () => over(entries, 5000), []);
t.done();
