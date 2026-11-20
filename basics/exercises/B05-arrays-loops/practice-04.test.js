import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["いちばん安い: 450円"]);
t.output("答え合わせが prices を [100, 300, 200] に変えた場合", ["いちばん安い: 100円"], { prices: [100, 300, 200] });
t.output("答え合わせが prices を [300, 100, 200] に変えた場合", ["いちばん安い: 100円"], { prices: [300, 100, 200] });
t.output("答え合わせが prices を [500] に変えた場合", ["いちばん安い: 500円"], { prices: [500] });
t.output("答え合わせが prices を [200000, 150000] に変えた場合", ["いちばん安い: 150000円"], { prices: [200000, 150000] });
t.done();
