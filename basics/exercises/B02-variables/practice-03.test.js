import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["残高: 3800円", "残高: 3000円", "残高: 6000円"]);
t.output("答え合わせが start を 10000 に変えた場合", ["残高: 8800円", "残高: 8000円", "残高: 11000円"], { start: 10000 });
t.uses(
  "balance を 3 回入れ直す",
  /((?<!let)balance[-+]?=(?!=)[\s\S]*){3}/,
  "balance を入れ直す行（balance = balance - 800; など）が 3 つ必要です。表示の ${ } の中で計算せずに、balance を入れ直してから表示します。",
);
t.done();
