import type { Entry, EntryKind, Filter } from "./types.ts";

export type CategoryTotal = {
  category: string;
  total: number;
};

export function monthOf(date: string): string {
  return date.slice(0, 7);
}

export function listMonths(entries: Entry[]): string[] {
  const months: string[] = [];
  for (const entry of entries) {
    const month = monthOf(entry.date);
    if (!months.includes(month)) {
      months.push(month);
    }
  }
  return months.sort().reverse();
}

export function filterEntries(entries: Entry[], filter: Filter): Entry[] {
  return entries
    .filter((entry) => filter.month === "all" || monthOf(entry.date) === filter.month)
    .filter((entry) => filter.kind === "all" || entry.kind === filter.kind);
}

export function sortByDate(entries: Entry[]): Entry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date));
}

export function totalOf(entries: Entry[], kind: EntryKind): number {
  return entries
    .filter((entry) => entry.kind === kind)
    .reduce((sum, entry) => sum + entry.amount, 0);
}

export function balanceOf(entries: Entry[]): number {
  return totalOf(entries, "income") - totalOf(entries, "expense");
}

export function totalsByCategory(entries: Entry[]): CategoryTotal[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    if (entry.kind === "expense") {
      totals.set(entry.category, (totals.get(entry.category) ?? 0) + entry.amount);
    }
  }
  return [...totals]
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

// 実践編 第5章 改修: 収入を入金元ごとに合計し、金額の大きい順に返す
export type SourceTotal = {
  source: string;
  total: number;
};

export function totalsBySource(entries: Entry[]): SourceTotal[] {
  throw new Error("TODO: ここを実装してください");
}
