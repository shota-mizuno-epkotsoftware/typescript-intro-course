import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", ["1000円以上: 3件"]);
t.output("答え合わせが amounts を [999, 1000, 1001] に変えた場合", ["1000円以上: 2件"], { amounts: [999, 1000, 1001] });
t.output("答え合わせが amounts を [] に変えた場合", ["1000円以上: 0件"], { amounts: [] });
t.done();
