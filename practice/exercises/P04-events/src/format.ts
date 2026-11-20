import type { Entry } from "./types.ts";

export function formatYen(amount: number): string {
  return `${amount.toLocaleString("ja-JP")}円`;
}

export function formatSignedYen(entry: Entry): string {
  const sign = entry.kind === "income" ? "+" : "-";
  return `${sign}${formatYen(entry.amount)}`;
}

export function entryLabel(entry: Entry): string {
  if (entry.kind === "income") {
    return entry.source;
  }
  return entry.category;
}

export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split("-");
  return `${year}年${Number(monthNumber)}月`;
}

// 実践編 第4章 改修: 10,000 円以上の支出なら true を返す
export function isLargeExpense(entry: Entry): boolean {
  throw new Error("TODO: ここを実装してください");
}
