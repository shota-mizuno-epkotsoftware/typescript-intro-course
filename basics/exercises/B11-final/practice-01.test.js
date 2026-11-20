import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["食費: 4700円", "記録: 4件", "食費は予算の半分以内です"]);
t.output("答え合わせが budget を 8000 に変えた場合", ["食費: 4700円", "記録: 4件", "食費が予算の半分を超えています"], { budget: 8000 });
t.avoids("食費の合計を直接書かない", /\b4700\b/, "4700 を直接書かずに、totalOf の計算で求めてください。");
t.uses("件数を配列から求める", /\.length/, "記録の件数は、4 と直接書かずに、entries の要素の数から求めてください。");
t.done();
