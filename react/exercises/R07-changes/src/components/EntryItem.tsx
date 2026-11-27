import { useState } from "react";
import { entryLabel, formatSignedYen } from "../format.ts";
import type { Entry } from "../types.ts";

interface EntryItemProps {
  entry: Entry;
  onRemove: (id: string) => void;
}

export function EntryItem({ entry, onRemove }: EntryItemProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li>
      <span className="date">{entry.date}</span>
      <span>
        <span className="label">{entryLabel(entry)}</span>
        {entry.memo !== undefined && <span className="memo"> {entry.memo}</span>}
      </span>
      <span className={`amount amount-${entry.kind}`}>{formatSignedYen(entry)}</span>
      {confirming ? (
        <span>
          <button className="remove" onClick={() => onRemove(entry.id)}>
            削除する
          </button>
          <button className="remove" onClick={() => setConfirming(false)}>
            やめる
          </button>
        </span>
      ) : (
        <button className="remove" onClick={() => setConfirming(true)}>
          削除
        </button>
      )}
    </li>
  );
}
