import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { makeEntry, changeAmount } = await t.load("makeEntry", "changeAmount");
t.equal(
  'makeEntry("2026-04-01", "食費", 1200)',
  () => makeEntry("2026-04-01", "食費", 1200),
  { date: "2026-04-01", category: "食費", amount: 1200 },
);
t.equal(
  'makeEntry("2026-04-02", "交通費", 500)',
  () => makeEntry("2026-04-02", "交通費", 500),
  { date: "2026-04-02", category: "交通費", amount: 500 },
);
t.equal(
  "changeAmount(1200 円の食費の記録, 1500)",
  () => changeAmount({ date: "2026-04-01", category: "食費", amount: 1200 }, 1500),
  { date: "2026-04-01", category: "食費", amount: 1500 },
);
t.equal(
  "changeAmount(500 円の交通費の記録, 0)",
  () => changeAmount({ date: "2026-04-02", category: "交通費", amount: 500 }, 0),
  { date: "2026-04-02", category: "交通費", amount: 0 },
);
t.equal(
  "changeAmount を呼んだ後の、渡した元の記録の金額",
  () => {
    const entry = { date: "2026-04-01", category: "食費", amount: 1200 };
    changeAmount(entry, 1500);
    return entry.amount;
  },
  1500,
);
t.done();
