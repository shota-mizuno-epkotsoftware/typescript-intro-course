import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["残りわずかです"]);
t.output("答え合わせが balance を 10000 に変えた場合", ["余裕があります"], { balance: 10000 });
t.output("答え合わせが balance を 9999 に変えた場合", ["普通です"], { balance: 9999 });
t.output("答え合わせが balance を 3000 に変えた場合", ["普通です"], { balance: 3000 });
t.output("答え合わせが balance を 0 に変えた場合", ["残りわずかです"], { balance: 0 });
t.output("答え合わせが balance を -500 に変えた場合", ["赤字です"], { balance: -500 });
t.done();
