import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { largest } = await t.load("largest");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-03", category: "交通費", amount: 480 },
  { date: "2026-04-05", category: "食費", amount: 3500 },
  { date: "2026-04-10", category: "趣味", amount: 2800 },
];
t.equal("largest(entries) は 4 月 5 日の記録", () => largest(entries), { date: "2026-04-05", category: "食費", amount: 3500 });
t.equal(
  "いちばん大きい記録が最後にあっても見つける",
  () => largest([{ date: "2026-05-01", category: "食費", amount: 650 }, { date: "2026-05-02", category: "趣味", amount: 9000 }]),
  { date: "2026-05-02", category: "趣味", amount: 9000 },
);
t.equal(
  "金額が小さい記録だけでも、その中でいちばん大きいものを返す",
  () => largest([{ date: "2026-06-01", category: "食費", amount: 300 }, { date: "2026-06-02", category: "食費", amount: 1200 }, { date: "2026-06-03", category: "趣味", amount: 800 }]),
  { date: "2026-06-02", category: "食費", amount: 1200 },
);
t.equal("largest([]) は undefined", () => largest([]), undefined);
t.done();
