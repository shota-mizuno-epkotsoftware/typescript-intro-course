import { sortByDate } from "../summary.ts";
import type { Entry } from "../types.ts";
import { EntryItem } from "./EntryItem.tsx";

type EntryListProps = {
  entries: Entry[];
  onRemove: (id: string) => void;
};

export function EntryList({ entries, onRemove }: EntryListProps) {
  return (
    <>
      <ul className="entries">
        {sortByDate(entries).map((entry) => (
          <EntryItem key={entry.id} entry={entry} onRemove={onRemove} />
        ))}
      </ul>
      {entries.length === 0 && <p className="status">明細はまだありません。</p>}
    </>
  );
}
