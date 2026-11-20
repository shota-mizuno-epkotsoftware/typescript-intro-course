export type Expense = {
  name: string;
  amount: number;
};

export function formatYen(amount: number): string {
  return `${amount.toLocaleString("ja-JP")}円`;
}

export function formatLine(expense: Expense): string {
  return `${expense.name}: ${formatYen(expense.amount)}`;
}

export function sumAmounts(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function parseExpense(name: string, amountText: string): Expense | string {
  const trimmed = name.trim();
  if (trimmed === "") {
    return "名前を入力してください";
  }
  const amount = Number(amountText);
  if (!Number.isInteger(amount) || amount < 1) {
    return "金額は 1 以上の整数で入力してください";
  }
  return { name: trimmed, amount };
}
