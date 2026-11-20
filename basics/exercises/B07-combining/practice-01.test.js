import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { subtotal, payment } = await t.load("subtotal", "payment");
t.equal("subtotal(120, 3) は 360", () => subtotal(120, 3), 360);
t.equal("payment(120, 3) は 860", () => payment(120, 3), 860);
t.equal("payment(1000, 2) は 2500", () => payment(1000, 2), 2500);
t.calls("payment", payment, "subtotal");
// payment の { } の中だけを調べる（subtotal の中の price * count は見ない）
const recalculates = { test: () => /price\s*\*\s*count/.test(String(payment).replace(/\/\/.*$/gm, "")) };
t.avoids("payment の中で、小計をもう一度計算しない", recalculates, "payment の中で、price * count をもう一度計算しています。subtotal の戻り値を変数に入れて使ってください。");
t.done();
