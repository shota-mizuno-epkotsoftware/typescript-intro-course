import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["合計: 5450円"]);
t.output("答え合わせが amounts を [100, 200] に変えた場合", ["合計: 300円"], { amounts: [100, 200] });
t.output("答え合わせが amounts を [] に変えた場合", ["合計: 0円"], { amounts: [] });
t.done();
