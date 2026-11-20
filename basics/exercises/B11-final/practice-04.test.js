import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { budgetReport } = await t.load("budgetReport");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-03", category: "交通費", amount: 480 },
  { date: "2026-04-05", category: "食費", amount: 3500 },
  { date: "2026-04-10", category: "趣味", amount: 2800 },
];
t.equal("budgetReport(entries, 10000) は、残りを知らせる", () => budgetReport(entries, 10000), "合計 7980円（残り 2020円）");
t.equal("budgetReport(entries, 5000) は、予算オーバーを知らせる", () => budgetReport(entries, 5000), "合計 7980円（2980円の予算オーバー）");
t.equal("合計が予算とちょうど同じなら、残り 0円", () => budgetReport(entries, 7980), "合計 7980円（残り 0円）");
t.equal("budgetReport([], 3000) は、残り 3000円", () => budgetReport([], 3000), "合計 0円（残り 3000円）");
const others = [
  { date: "2026-05-01", category: "食費", amount: 650 },
  { date: "2026-05-02", category: "趣味", amount: 9000 },
];
t.equal("ほかの記録でも、残りを知らせる", () => budgetReport(others, 10000), "合計 9650円（残り 350円）");
t.equal("ほかの記録でも、予算オーバーを知らせる", () => budgetReport(others, 9000), "合計 9650円（650円の予算オーバー）");
t.done();
