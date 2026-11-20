export type Entry =
  | { kind: "income"; amount: number; source: string }
  | { kind: "expense"; amount: number; category: string };

export function formatEntry(entry: Entry): string {
  if (entry.kind === "income") {
    return `+${entry.amount} ${entry.source}`;
  }
  return `-${entry.amount} ${entry.category}`;
}

export function parseAmount(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }
  const amount = Number(value);
  return Number.isNaN(amount) ? null : amount;
}
