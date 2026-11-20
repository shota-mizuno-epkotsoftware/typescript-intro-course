import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["おつり: 220円"]);
t.output("答え合わせが price を 300、paid を 500 に変えた場合", ["おつり: 200円"], { price: 300, paid: 500 });
t.uses("おつりを change に入れてから表示する", /(const|let)change=[\s\S]*\$\{change\}/, "おつりは const change = ...; の行で計算し、表示の行は ${change} のままにしてください。");
t.done();
