import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { total } = await t.load("total");
t.equal("total([100, 200, 300]) は 600", () => total([100, 200, 300]), 600);
t.equal("total([500]) は 500", () => total([500]), 500);
t.equal("total([]) は 0", () => total([]), 0);
t.done();
