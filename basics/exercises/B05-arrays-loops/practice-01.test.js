import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["合計: 5000円", "最後: 3000円"]);
t.output("答え合わせが prices を [500, 200] に変えた場合", ["合計: 700円", "最後: 200円"], { prices: [500, 200] });
t.output("答え合わせが prices を [100] に変えた場合", ["合計: 100円", "最後: 100円"], { prices: [100] });
t.done();
