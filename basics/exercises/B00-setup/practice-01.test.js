import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("2 行を表示する", ["基礎編を始めます", "よろしくお願いします"]);
t.done();
