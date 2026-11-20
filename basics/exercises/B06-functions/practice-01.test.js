import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { subtotal, shippingFee } = await t.load("subtotal", "shippingFee");
t.equal("subtotal(120, 3) は 360", () => subtotal(120, 3), 360);
t.equal("subtotal(80, 0) は 0", () => subtotal(80, 0), 0);
t.equal("shippingFee(3000) は 0", () => shippingFee(3000), 0);
t.equal("shippingFee(2999) は 500", () => shippingFee(2999), 500);
t.done();
