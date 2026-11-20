import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { amountsOfCategory } = await t.load("amountsOfCategory");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
  { date: "2026-04-04", category: "趣味", amount: 1000 },
];
t.equal('amountsOfCategory(entries, "食費") は [1200, 800]', () => amountsOfCategory(entries, "食費"), [1200, 800]);
t.equal('amountsOfCategory(entries, "趣味") は [1000]', () => amountsOfCategory(entries, "趣味"), [1000]);
t.equal('記録のないカテゴリ（"日用品"）は、空の配列', () => amountsOfCategory(entries, "日用品"), []);
t.uses("filter と map を使う", /\.filter\([\s\S]*\.map\(|\.map\([\s\S]*\.filter\(/, "この演習では、filter と map を使って書いてください（9.5）。");
t.done();
