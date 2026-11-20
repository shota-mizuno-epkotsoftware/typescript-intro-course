import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { remaining } = await t.load("remaining");
const april = {
  name: "4月",
  budget: 30000,
  entries: [
    { date: "2026-04-01", category: "食費", amount: 1200 },
    { date: "2026-04-02", category: "交通費", amount: 500 },
  ],
};
t.equal("予算 30000、記録 2 件（1200 と 500）なら 28300", () => remaining(april), 28300);
t.equal("記録がなければ、予算と同じ", () => remaining({ name: "5月", budget: 20000, entries: [] }), 20000);
t.equal(
  "使いすぎたら、0 より小さい数",
  () => remaining({ name: "6月", budget: 1000, entries: [{ date: "2026-06-01", category: "趣味", amount: 1500 }] }),
  -500,
);
t.done();
