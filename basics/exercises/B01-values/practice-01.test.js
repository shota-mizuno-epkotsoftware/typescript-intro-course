import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("3 行を表示する", ["りんご: 120円", "みかん: 80円", "合計: 200円"]);
t.done();
