// 第5章 演習: 家計簿のデータの型
// 1. Category と Expense の型を、コメントのとおりに書き直してください。
// 2. throw の行を書き換えて、emptyTotals と totalByCategory を実装してください。

// 分類。"food"（食費）、"transport"（交通費）、"other"（その他）のどれか。
export type Category = string;

// 1 件の支出。category（分類）、amount（金額）、memo（メモ。省略できる）を持つ。
export type Expense = {
  amount: number;
};

// すべての分類が 0 の合計を返す。
// 例: { food: 0, transport: 0, other: 0 }
export function emptyTotals(): Record<Category, number> {
  throw new Error("TODO: ここを実装してください");
}

// 分類ごとの合計を返す。支出がない分類は 0 にする。
// 例: { food: 1300, transport: 200, other: 0 }
export function totalByCategory(expenses: Expense[]): Record<Category, number> {
  throw new Error("TODO: ここを実装してください");
}
