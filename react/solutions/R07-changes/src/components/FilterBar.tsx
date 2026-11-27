import type { ChangeEvent } from "react";
import { formatMonth } from "../format.ts";
import { listMonths } from "../summary.ts";
import type { Entry, Filter } from "../types.ts";

type FilterBarProps = {
  entries: Entry[];
  filter: Filter;
  onFilterChange: (changes: Partial<Filter>) => void;
};

export function FilterBar({ entries, filter, onFilterChange }: FilterBarProps) {
  const months = listMonths(entries);
  const isFiltering = filter.month !== "all" || filter.kind !== "all";

  function handleKindChange(event: ChangeEvent<HTMLSelectElement>): void {
    const kind = event.target.value;
    if (kind === "all" || kind === "income" || kind === "expense") {
      onFilterChange({ kind });
    }
  }

  return (
    <div className="filters">
      <label>
        月
        <select value={filter.month} onChange={(event) => onFilterChange({ month: event.target.value })}>
          <option value="all">すべて</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {formatMonth(month)}
            </option>
          ))}
        </select>
      </label>
      <label>
        種別
        <select value={filter.kind} onChange={handleKindChange}>
          <option value="all">すべて</option>
          <option value="income">収入</option>
          <option value="expense">支出</option>
        </select>
      </label>
      {isFiltering && <button onClick={() => onFilterChange({ month: "all", kind: "all" })}>絞り込みを解除</button>}
    </div>
  );
}
