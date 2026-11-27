import type { Entry } from "./types.ts";
import { isValidAmount, isValidDate } from "./validate.ts";

const STORAGE_KEY = "kakeibo:entries";

function toEntry(value: unknown): Entry | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  // プロパティを名前で読めるように、Record 型の変数にコピーする
  const record: Record<string, unknown> = { ...value };
  const { kind, id, date, amount, source, category, memo } = record;

  if (typeof id !== "string" || typeof date !== "string" || !isValidDate(date)) {
    return null;
  }
  if (typeof amount !== "number" || !isValidAmount(amount)) {
    return null;
  }
  const common = typeof memo === "string" ? { id, date, amount, memo } : { id, date, amount };

  if (kind === "income" && typeof source === "string") {
    return { kind, ...common, source };
  }
  if (kind === "expense" && typeof category === "string") {
    return { kind, ...common, category };
  }
  return null;
}

export function parseStoredEntries(text: string | null): Entry[] {
  if (text === null) {
    return [];
  }
  try {
    const data: unknown = JSON.parse(text);
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map(toEntry).filter((entry) => entry !== null);
  } catch {
    return [];
  }
}

export function loadEntries(): Entry[] {
  return parseStoredEntries(localStorage.getItem(STORAGE_KEY));
}

export function saveEntries(entries: Entry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}
