import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["税: 80円", "税込: 880円"]);
t.output("答え合わせが price を 1500、taxPercent を 8 に変えた場合", ["税: 120円", "税込: 1620円"], { price: 1500, taxPercent: 8 });
t.done();
