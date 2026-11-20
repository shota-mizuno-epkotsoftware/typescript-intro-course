export type Elements = {
  form: HTMLFormElement;
  kind: HTMLSelectElement;
  date: HTMLInputElement;
  amount: HTMLInputElement;
  category: HTMLSelectElement;
  source: HTMLInputElement;
  memo: HTMLInputElement;
  categoryField: HTMLElement;
  sourceField: HTMLElement;
  categoryStatus: HTMLElement;
  formErrors: HTMLElement;
  filterMonth: HTMLSelectElement;
  filterKind: HTMLSelectElement;
  filterKeyword: HTMLInputElement;
  totalIncome: HTMLElement;
  totalExpense: HTMLElement;
  balance: HTMLElement;
  categoryTotals: HTMLElement;
  entryList: HTMLElement;
  emptyMessage: HTMLElement;
};

function findElement(selector: string): HTMLElement {
  const element = document.querySelector(selector);
  if (!(element instanceof HTMLElement)) {
    throw new Error(`要素が見つかりません: ${selector}`);
  }
  return element;
}

function findInput(selector: string): HTMLInputElement {
  const element = findElement(selector);
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`入力欄ではありません: ${selector}`);
  }
  return element;
}

function findSelect(selector: string): HTMLSelectElement {
  const element = findElement(selector);
  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`選択欄ではありません: ${selector}`);
  }
  return element;
}

export function getElements(): Elements {
  const form = findElement("#entry-form");
  if (!(form instanceof HTMLFormElement)) {
    throw new Error("フォームが見つかりません: #entry-form");
  }
  return {
    form,
    kind: findSelect("#kind"),
    date: findInput("#date"),
    amount: findInput("#amount"),
    category: findSelect("#category"),
    source: findInput("#source"),
    memo: findInput("#memo"),
    categoryField: findElement("#category-field"),
    sourceField: findElement("#source-field"),
    categoryStatus: findElement("#category-status"),
    formErrors: findElement("#form-errors"),
    filterMonth: findSelect("#filter-month"),
    filterKind: findSelect("#filter-kind"),
    filterKeyword: findInput("#filter-keyword"),
    totalIncome: findElement("#total-income"),
    totalExpense: findElement("#total-expense"),
    balance: findElement("#balance"),
    categoryTotals: findElement("#category-totals"),
    entryList: findElement("#entry-list"),
    emptyMessage: findElement("#empty-message"),
  };
}
