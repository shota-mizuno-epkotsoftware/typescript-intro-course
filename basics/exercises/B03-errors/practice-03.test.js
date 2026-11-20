import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["合計: 3100円"]);
t.output(
  "答え合わせが price を 1000、count を 3、discount を 100 に変えた場合",
  ["合計: 3200円"],
  { price: 1000, count: 3, discount: 100 },
);
t.done();
