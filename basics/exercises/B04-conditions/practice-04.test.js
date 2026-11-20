import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["予算オーバーです", "超えた金額: 2500円"]);
t.output("答え合わせが spent を 28000 に変えた場合", ["予算内です", "残り: 2000円"], { spent: 28000 });
t.output("答え合わせが budget を 20000、spent を 20000 に変えた場合", ["予算内です", "残り: 0円"], { budget: 20000, spent: 20000 });
t.output("答え合わせが budget を 20000、spent を 21000 に変えた場合", ["予算オーバーです", "超えた金額: 1000円"], { budget: 20000, spent: 21000 });
t.done();
