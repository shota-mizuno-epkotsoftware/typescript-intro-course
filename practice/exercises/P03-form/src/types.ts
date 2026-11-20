export type Income = {
  kind: "income";
  id: string;
  date: string;
  amount: number;
  source: string;
  memo?: string;
};

export type Expense = {
  kind: "expense";
  id: string;
  date: string;
  amount: number;
  category: string;
  memo?: string;
};

export type Entry = Income | Expense;

export type EntryKind = "income" | "expense";

export type Filter = {
  month: string;
  kind: "all" | EntryKind;
};

export type CategoriesState =
  | { status: "loading" }
  | { status: "ready"; items: string[] }
  | { status: "error"; message: string };

export type AppState = {
  entries: Entry[];
  filter: Filter;
  categories: CategoriesState;
  formKind: EntryKind;
  formErrors: string[];
};
