import type { Entry } from "./types.ts";

export type FormInput = {
  kind: string;
  date: string;
  amount: string;
  category: string;
  source: string;
  memo: string;
};

export type ParseResult = { ok: true; entry: Entry } | { ok: false; errors: string[] };

export function isValidDate(text: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(text);
}

export function isValidAmount(amount: number): boolean {
  return Number.isInteger(amount) && amount >= 1;
}

export function parseAmount(text: string): number | null {
  const amount = Number(text);
  return isValidAmount(amount) ? amount : null;
}

export function parseEntryForm(input: FormInput, id: string): ParseResult {
  const { kind, date } = input;
  const amount = parseAmount(input.amount);
  const category = input.category.trim();
  const source = input.source.trim();
  const memo = input.memo.trim();

  const errors: string[] = [];
  if (kind !== "income" && kind !== "expense") {
    errors.push("種別を選んでください");
  }
  if (!isValidDate(date)) {
    errors.push("日付を入力してください");
  }
  if (amount === null) {
    errors.push("金額は 1 以上の整数で入力してください");
  }
  if (kind === "expense" && category === "") {
    errors.push("分類を選んでください");
  }
  if (kind === "income" && source === "") {
    errors.push("入金元を入力してください");
  }

  // 間違いがあれば、明細を作らずに返す
  if (errors.length > 0 || amount === null) {
    return { ok: false, errors };
  }

  const entry: Entry =
    kind === "income"
      ? { kind: "income", id, date, amount, source }
      : { kind: "expense", id, date, amount, category };

  return { ok: true, entry: memo === "" ? entry : { ...entry, memo } };
}

// 実践編 第3章 改修: メモが 20 文字以内なら true を返す
export function isValidMemo(memo: string): boolean {
  throw new Error("TODO: ここを実装してください");
}
