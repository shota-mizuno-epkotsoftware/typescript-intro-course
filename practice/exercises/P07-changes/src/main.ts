import { fetchCategories } from "./categories.ts";
import { getElements } from "./elements.ts";
import { render } from "./render.ts";
import {
  addEntry,
  createInitialState,
  removeEntry,
  setCategories,
  setFilter,
  setFormErrors,
  setFormKind,
} from "./state.ts";
import { loadEntries, saveEntries } from "./storage.ts";
import type { AppState } from "./types.ts";
import { parseEntryForm } from "./validate.ts";

const elements = getElements();
let state = createInitialState(loadEntries());

// 状態を新しくし、明細が変わっていれば保存して、画面を作り直す
function update(next: AppState): void {
  if (next.entries !== state.entries) {
    saveEntries(next.entries);
  }
  state = next;
  render(state, elements);
}

async function loadCategories(): Promise<void> {
  try {
    const items = await fetchCategories();
    update(setCategories(state, { status: "ready", items }));
  } catch (e) {
    console.error(e);
    const message = "分類を読み込めませんでした。ページを読み込み直してください。";
    update(setCategories(state, { status: "error", message }));
  }
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = parseEntryForm(
    {
      kind: elements.kind.value,
      date: elements.date.value,
      amount: elements.amount.value,
      category: elements.category.value,
      source: elements.source.value,
      memo: elements.memo.value,
    },
    crypto.randomUUID(),
  );
  if (!result.ok) {
    update(setFormErrors(state, result.errors));
    return;
  }

  elements.form.reset();
  update(addEntry(state, result.entry));
});

elements.kind.addEventListener("change", () => {
  const kind = elements.kind.value;
  if (kind === "income" || kind === "expense") {
    update(setFormKind(state, kind));
  }
});

elements.filterMonth.addEventListener("change", () => {
  update(setFilter(state, { month: elements.filterMonth.value }));
});

elements.filterKind.addEventListener("change", () => {
  const kind = elements.filterKind.value;
  if (kind === "all" || kind === "income" || kind === "expense") {
    update(setFilter(state, { kind }));
  }
});

elements.filterKeyword.addEventListener("input", () => {
  update(setFilter(state, { keyword: elements.filterKeyword.value }));
});

elements.entryList.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }
  const id = event.target.dataset.id;
  if (id !== undefined) {
    update(removeEntry(state, id));
  }
});

render(state, elements);
await loadCategories();
