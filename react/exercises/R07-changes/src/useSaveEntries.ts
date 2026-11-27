import { useEffect } from "react";
import { saveEntries } from "./storage.ts";
import type { Entry } from "./types.ts";

// 明細が変わったら保存する
export function useSaveEntries(entries: Entry[]): void {
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);
}
