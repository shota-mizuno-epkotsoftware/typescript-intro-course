// 第11章 演習（1）: メモのデータを扱う関数
// throw の行を書き換えて、それぞれの関数を実装してください。

export type Memo = {
  id: string;
  text: string;
};

// localStorage から読んだ値を、メモの配列にして返す。保存がない（null の）ときは空の配列を返す。
export function parseMemos(saved: string | null): Memo[] {
  throw new Error("TODO: ここを実装してください");
}

// 指定した id のメモを除いた、新しい配列を返す。元の配列は変えない。
export function removeMemo(memos: Memo[], id: string): Memo[] {
  throw new Error("TODO: ここを実装してください");
}
