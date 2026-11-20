import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["品物: ノート", "値段: 120円", "小計: 360円"]);
t.output("答え合わせが price を 200、count を 4 に変えた場合", ["品物: ノート", "値段: 200円", "小計: 800円"], { price: 200, count: 4 });
t.done();
