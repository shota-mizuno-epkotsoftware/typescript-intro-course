import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["小計: 1800円", "送料込み: 2300円"]);
t.output("答え合わせが price を 300、count を 2 に変えた場合", ["小計: 600円", "送料込み: 1100円"], { price: 300, count: 2 });
t.done();
