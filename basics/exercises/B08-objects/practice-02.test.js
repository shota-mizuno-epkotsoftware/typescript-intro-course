import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { entryText } = await t.load("entryText");
t.equal(
  "食費の記録を文字列にする",
  () => entryText({ date: "2026-04-01", category: "食費", amount: 1200 }),
  "2026-04-01 食費: 1200円",
);
t.equal(
  "交通費の記録を文字列にする",
  () => entryText({ date: "2026-04-02", category: "交通費", amount: 500 }),
  "2026-04-02 交通費: 500円",
);
t.done();
