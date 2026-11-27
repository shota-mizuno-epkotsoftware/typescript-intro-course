import { monthOf } from "./summary.ts";
import type { AppState, CategoriesState, Entry, EntryKind, Filter } from "./types.ts";

export function createInitialState(entries: Entry[]): AppState {
  return {
    entries,
    filter: { month: "all", kind: "all" },
    categories: { status: "loading" },
    formKind: "expense",
    formErrors: [],
  };
}

export function addEntry(state: AppState, entry: Entry): AppState {
  return { ...state, entries: [...state.entries, entry], formErrors: [] };
}

export function removeEntry(state: AppState, id: string): AppState {
  const index = state.entries.findIndex((entry) => entry.id === id);
  if (index !== -1) {
    state.entries.splice(index, 1);
  }
  const { month } = state.filter;
  const monthRemains = month === "all" || state.entries.some((entry) => monthOf(entry.date) === month);
  if (!monthRemains) {
    state.filter.month = "all";
  }
  return state;
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
