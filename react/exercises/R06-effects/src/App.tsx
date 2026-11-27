import { useEffect, useState } from "react";
import { fetchCategories } from "./categories.ts";
import { EntryForm } from "./components/EntryForm.tsx";
import { EntryList } from "./components/EntryList.tsx";
import { FilterBar } from "./components/FilterBar.tsx";
import { Summary } from "./components/Summary.tsx";
import {
  addEntry,
  createInitialState,
  removeEntry,
  setCategories,
  setFilter,
  setFormErrors,
  setFormKind,
} from "./state.ts";
import { saveEntries } from "./storage.ts";
import { filterEntries } from "./summary.ts";
import type { Entry, EntryKind, Filter } from "./types.ts";

type AppProps = {
  initialEntries: Entry[];
};

export function App({ initialEntries }: AppProps) {
  const [state, setState] = useState(createInitialState(initialEntries));

  // 明細が変わったら保存する
  useEffect(() => {
    saveEntries(state.entries);
  }, []);

  // 最初に 1 回、分類の一覧を読み込む
  useEffect(() => {
    let ignore = false;

    async function loadCategories(): Promise<void> {
      try {
        const items = await fetchCategories();
        if (!ignore) {
          setState((prev) => setCategories(prev, { status: "ready", items }));
        }
      } catch (e) {
        console.error(e);
        const message = "分類を読み込めませんでした。ページを読み込み直してください。";
        if (!ignore) {
          setState((prev) => setCategories(prev, { status: "error", message }));
        }
      }
    }

    loadCategories();

    // 後片付け。この読み込みの結果は、もう使わない
    return () => {
      ignore = true;
    };
  }, []);

  function handleAdd(entry: Entry): void {
    setState((prev) => addEntry(prev, entry));
  }

  function handleFormErrors(errors: string[]): void {
    setState((prev) => setFormErrors(prev, errors));
  }

  function handleFormKindChange(kind: EntryKind): void {
    setState((prev) => setFormKind(prev, kind));
  }

  function handleFilterChange(changes: Partial<Filter>): void {
    setState((prev) => setFilter(prev, changes));
  }

  function handleRemove(id: string): void {
    setState((prev) => removeEntry(prev, id));
  }

  const visibleEntries = filterEntries(state.entries, state.filter);

  return (
    <>
      <h1>家計簿</h1>

      <section className="panel">
        <h2>明細を追加する</h2>
        <EntryForm
          kind={state.formKind}
          categories={state.categories}
          errors={state.formErrors}
          onKindChange={handleFormKindChange}
          onAdd={handleAdd}
          onErrors={handleFormErrors}
        />
      </section>

      <section className="panel">
        <h2>集計</h2>
        <FilterBar entries={state.entries} filter={state.filter} onFilterChange={handleFilterChange} />
        <Summary entries={visibleEntries} />
      </section>

      <section className="panel">
        <h2>明細</h2>
        <EntryList entries={visibleEntries} onRemove={handleRemove} />
      </section>
    </>
  );
}
