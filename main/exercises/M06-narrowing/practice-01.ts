// 第6章 演習: 値を調べてから使う
// throw の行を書き換えて、それぞれの関数を実装してください。as と ! は使わないこと。

// 収入か支出か（kind）で、持っているプロパティが違う。
export type Entry =
  | { kind: "income"; amount: number; source: string }
  | { kind: "expense"; amount: number; category: string };

// 収入なら「+1000 給料」、支出なら「-800 食費」の形の文字列を返す。
export function formatEntry(entry: Entry): string {
  throw new Error("TODO: ここを実装してください");
}

// 外から来た値を金額にする。
// 文字列でなければ null を返す。文字列は Number() で数値にして返す（NaN になるときは null）。
export function parseAmount(value: unknown): number | null {
  throw new Error("TODO: ここを実装してください");
}
