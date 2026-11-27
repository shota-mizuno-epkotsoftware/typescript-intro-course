import type { Entry } from "./types.ts";

export const sampleEntries: Entry[] = [
  { kind: "income", id: "a", date: "2026-10-25", amount: 200000, source: "給料" },
  { kind: "expense", id: "b", date: "2026-10-28", amount: 800, category: "食費", fixed: false, memo: "昼食" },
  { kind: "expense", id: "c", date: "2026-11-02", amount: 1200, category: "交通費", fixed: true },
  { kind: "expense", id: "d", date: "2026-11-05", amount: 500, category: "食費", fixed: false },
];
