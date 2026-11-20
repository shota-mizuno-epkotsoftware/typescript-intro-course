export type Memo = {
  id: string;
  text: string;
};

export function parseMemos(saved: string | null): Memo[] {
  if (saved === null) {
    return [];
  }
  return JSON.parse(saved);
}

export function removeMemo(memos: Memo[], id: string): Memo[] {
  return memos.filter((memo) => memo.id !== id);
}
