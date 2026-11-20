import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["送料: 500円", "支払い: 3300円"]);
t.output("答え合わせが total を 3000 に変えた場合", ["送料: 0円", "支払い: 3000円"], { total: 3000 });
t.output("答え合わせが total を 3001 に変えた場合", ["送料: 0円", "支払い: 3001円"], { total: 3001 });
t.output("答え合わせが total を 1000、isMember を true に変えた場合", ["送料: 0円", "支払い: 1000円"], { total: 1000, isMember: true });
t.output("答え合わせが total を 2999 に変えた場合", ["送料: 500円", "支払い: 3499円"], { total: 2999 });
t.done();
