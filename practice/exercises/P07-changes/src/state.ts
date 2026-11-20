import { monthOf } from "./summary.ts";
import type { AppState, CategoriesState, Entry, EntryKind, Filter } from "./types.ts";

const noFilter: Filter = { month: "all", kind: "all", keyword: "" };

export function createInitialState(entries: Entry[]): AppState {
  return {
    entries,
    filter: noFilter,
    categories: { status: "loading" },
    formKind: "expense",
    formErrors: [],
  };
}

export function addEntry(state: AppState, entry: Entry): AppState {
  return { ...state, entries: [...state.entries, entry], formErrors: [] };
}

export function removeEntry(state: AppState, id: string): AppState {
  const entries = state.entries.filter((entry) => entry.id !== id);
  const { month } = state.filter;
  const monthRemains = month === "all" || entries.some((entry) => monthOf(entry.date) === month);
  return {
    ...state,
    entries,
    filter: monthRemains ? state.filter : noFilter,
  };
}

export function setFilter(state: AppState, changes: Partial<Filter>): AppState {
  return { ...state, filter: { ...state.filter, ...changes } };
}

export function setCategories(state: AppState, categories: CategoriesState): AppState {
  return { ...state, categories };
}

export function setFormKind(state: AppState, formKind: EntryKind): AppState {
  return { ...state, formKind, formErrors: [] };
}

export function setFormErrors(state: AppState, formErrors: string[]): AppState {
  return { ...state, formErrors };
}
