import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
const { budgetMessage } = await t.load("budgetMessage");
t.equal("budgetMessage(30000, 20500) は「予算内（残り 9500円）」", () => budgetMessage(30000, 20500), "予算内（残り 9500円）");
t.equal("budgetMessage(30000, 30000) は「予算内（残り 0円）」", () => budgetMessage(30000, 30000), "予算内（残り 0円）");
t.equal("budgetMessage(30000, 31500) は「予算オーバー（1500円）」", () => budgetMessage(30000, 31500), "予算オーバー（1500円）");
t.equal("budgetMessage(10000, 10500) は「予算オーバー（500円）」", () => budgetMessage(10000, 10500), "予算オーバー（500円）");
t.done();
