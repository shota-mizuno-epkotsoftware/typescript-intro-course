import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["合計: 2100円"]);
t.output("答え合わせが price を 500、count を 3 に変えた場合", ["合計: 1200円"], { price: 500, count: 3 });
t.done();
