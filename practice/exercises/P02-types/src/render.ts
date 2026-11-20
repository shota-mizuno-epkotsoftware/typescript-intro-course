import type { Elements } from "./elements.ts";
import { entryLabel, formatMonth, formatSignedYen, formatYen } from "./format.ts";
import { balanceOf, filterEntries, listMonths, sortByDate, totalOf, totalsByCategory } from "./summary.ts";
import type { AppState, Entry } from "./types.ts";

function createOption(value: string, label: string): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function createText(tag: string, text: string, className = ""): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  element.className = className;
  return element;
}

// 選択肢を入れ替える。入れ替える前に選ばれていた値が新しい選択肢にもあれば、選び直す
function replaceOptions(select: HTMLSelectElement, options: HTMLOptionElement[]): void {
  const selected = select.value;
  select.replaceChildren(...options);
  if (options.some((option) => option.value === selected)) {
    select.value = selected;
  }
}

function categoryStatusText({ categories }: AppState): string {
  if (categories.status === "loading") {
    return "分類を読み込んでいます…";
  }
  if (categories.status === "error") {
    return categories.message;
  }
  return "";
}

function renderForm(state: AppState, elements: Elements): void {
  const isExpense = state.formKind === "expense";
  elements.kind.value = state.formKind;
  elements.categoryField.classList.toggle("hidden", !isExpense);
  elements.fixedField.classList.toggle("hidden", !isExpense);
  elements.sourceField.classList.toggle("hidden", isExpense);

  const { categories } = state;
  if (categories.status === "ready") {
    replaceOptions(elements.category, categories.items.map((item) => createOption(item, item)));
  }
  elements.categoryStatus.textContent = categoryStatusText(state);
  elements.categoryStatus.classList.toggle("error", categories.status === "error");

  elements.formErrors.replaceChildren(...state.formErrors.map((message) => createText("li", message)));
}

function renderFilter(state: AppState, elements: Elements): void {
  const months = listMonths(state.entries);
  elements.filterMonth.replaceChildren(
    createOption("all", "すべて"),
    ...months.map((month) => createOption(month, formatMonth(month))),
  );
  elements.filterMonth.value = state.filter.month;
  elements.filterKind.value = state.filter.kind;
}

function renderSummary(entries: Entry[], elements: Elements): void {
  const balance = balanceOf(entries);
  elements.totalIncome.textContent = formatYen(totalOf(entries, "income"));
  elements.totalExpense.textContent = formatYen(totalOf(entries, "expense"));
  elements.balance.textContent = formatYen(balance);
  elements.balance.className = balance < 0 ? "negative" : "positive";

  elements.categoryTotals.replaceChildren(
    ...totalsByCategory(entries).map(({ category, total }) =>
      createText("li", `${category}: ${formatYen(total)}`),
    ),
  );
}

function createEntryItem(entry: Entry): HTMLElement {
  const description = document.createElement("span");
  description.append(createText("span", entryLabel(entry), "label"));
  if (entry.memo !== undefined) {
    description.append(createText("span", ` ${entry.memo}`, "memo"));
  }

  const removeButton = createText("button", "削除", "remove");
  removeButton.dataset.id = entry.id;

  const item = document.createElement("li");
  item.append(
    createText("span", entry.date, "date"),
    description,
    createText("span", formatSignedYen(entry), `amount amount-${entry.kind}`),
    removeButton,
  );
  return item;
}

function renderList(entries: Entry[], elements: Elements): void {
  elements.entryList.replaceChildren(...sortByDate(entries).map(createEntryItem));
  elements.emptyMessage.classList.toggle("hidden", entries.length > 0);
}

export function render(state: AppState, elements: Elements): void {
  const visibleEntries = filterEntries(state.entries, state.filter);
  renderForm(state, elements);
  renderFilter(state, elements);
  renderSummary(visibleEntries, elements);
  renderList(visibleEntries, elements);
}
