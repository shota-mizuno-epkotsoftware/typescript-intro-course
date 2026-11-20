export type Category = "food" | "transport" | "other";

export type Expense = {
  category: Category;
  amount: number;
  memo?: string;
};

export function emptyTotals(): Record<Category, number> {
  return { food: 0, transport: 0, other: 0 };
}

export function totalByCategory(expenses: Expense[]): Record<Category, number> {
  const totals = emptyTotals();
  for (const expense of expenses) {
    totals[expense.category] = totals[expense.category] + expense.amount;
  }
  return totals;
}
