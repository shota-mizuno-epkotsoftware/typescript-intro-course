// 第10章 演習（1）: 画面に関係しない計算と検証
// formatYen と formatLine は用意してあります。sumAmounts から順に throw の行を書き換え、npm test M10 で確かめます。

export type Expense = {
  name: string;
  amount: number;
};

// 金額を「1,234円」の形にする（用意してあります。toLocaleString("ja-JP") は 3 けたごとに「,」で区切る）。
export function formatYen(amount: number): string {
  return `${amount.toLocaleString("ja-JP")}円`;
}

// 一覧の 1 行の文字を「昼食: 800円」の形で作る（用意してあります）。
export function formatLine(expense: Expense): string {
  return `${expense.name}: ${formatYen(expense.amount)}`;
}

// 支出の金額の合計を返す。
export function sumAmounts(expenses: Expense[]): number {
  throw new Error("TODO: ここを実装してください");
}

// 入力欄の文字列から、支出のデータを作る。
// - 名前が空（前後の空白を除いて空）なら「名前を入力してください」を返す
// - 金額が 1 以上の整数でなければ「金額は 1 以上の整数で入力してください」を返す
// - どちらも正しければ { name: 前後の空白を除いた名前, amount: 数値にした金額 } を返す
export function parseExpense(name: string, amountText: string): Expense | string {
  throw new Error("TODO: ここを実装してください");
}
