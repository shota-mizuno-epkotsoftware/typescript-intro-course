import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { total, payment } = await t.load("shippingFee", "total", "payment");
t.equal("total([1200, 800]) は 2000", () => total([1200, 800]), 2000);
t.equal("total([]) は 0", () => total([]), 0);
t.equal("payment([1200, 800]) は 2500", () => payment([1200, 800]), 2500);
t.equal("payment([2000, 1500]) は 3500", () => payment([2000, 1500]), 3500);
t.equal("payment([3000]) は 3000", () => payment([3000]), 3000);
t.calls("payment", payment, "total", "shippingFee");
t.done();
