import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { toLines } = await t.load("toLines");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-03", category: "交通費", amount: 480 },
  { date: "2026-04-05", category: "食費", amount: 3500 },
  { date: "2026-04-10", category: "趣味", amount: 2800 },
];
t.equal("toLines(entries) は 4 つの文字列", () => toLines(entries), [
  "2026-04-01 食費 1200円",
  "2026-04-03 交通費 480円",
  "2026-04-05 食費 3500円",
  "2026-04-10 趣味 2800円",
]);
t.equal("toLines([]) は空の配列", () => toLines([]), []);
t.equal("ほかの記録でも、同じ形の文字列にする", () => toLines([{ date: "2026-05-20", category: "住居", amount: 60000 }]), ["2026-05-20 住居 60000円"]);
t.done();
