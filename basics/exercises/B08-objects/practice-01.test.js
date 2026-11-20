import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { lastEntryText } = await t.load("lastEntryText");
const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
];
t.equal("3 件の配列を渡すと、3 件目を文字列にする", () => lastEntryText(entries), "食費: 800円");
t.equal("1 件の配列を渡すと、その 1 件を文字列にする", () => lastEntryText([entries[0]]), "食費: 1200円");
t.done();
