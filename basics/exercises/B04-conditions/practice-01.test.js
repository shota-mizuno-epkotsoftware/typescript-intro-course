import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["交通費以外の記録です", "食費: 1200円"]);
t.output('答え合わせが category を "交通費"、amount を 480 に変えた場合', ["交通費の記録です", "交通費: 480円"], { category: "交通費", amount: 480 });
t.output('答え合わせが category を "趣味"、amount を 300 に変えた場合', ["交通費以外の記録です", "趣味: 300円"], { category: "趣味", amount: 300 });
t.avoids("=== で比べる", /[^=!]==[^=]/, "「同じ」を比べる記号は === です。= は 3 つです。");
t.avoids("!== で比べる", /!=[^=]/, "「違う」を比べる記号は !== です。= は 2 つです。");
t.done();
