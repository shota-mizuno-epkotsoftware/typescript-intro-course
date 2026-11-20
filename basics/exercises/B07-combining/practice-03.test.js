import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { receiptLine } = await t.load("subtotal", "withTax", "receiptLine");
t.equal("receiptLine(\"ノート\", 120, 3) は「ノート: 396円」", () => receiptLine("ノート", 120, 3), "ノート: 396円");
t.equal("receiptLine(\"ペン\", 80, 2) は「ペン: 176円」", () => receiptLine("ペン", 80, 2), "ペン: 176円");
t.equal("receiptLine(\"消しゴム\", 100, 0) は「消しゴム: 0円」", () => receiptLine("消しゴム", 100, 0), "消しゴム: 0円");
t.calls("receiptLine", receiptLine, "subtotal", "withTax");
t.done();
