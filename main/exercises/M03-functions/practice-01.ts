// 第3章 演習: 関数を受け取る関数、関数を返す関数
// throw の行を書き換えて、それぞれの関数を実装してください。

// values のうち、condition が true を返す要素の数を返す。
// 例: countIf([1, 5, 10], (n) => n >= 5) は 2
export function countIf(values: number[], condition: (n: number) => boolean): number {
  throw new Error("TODO: ここを実装してください");
}

// 受け取った数に factor を掛ける「関数」を返す。
// 例: makeMultiplier(3) が返す関数に 4 を渡すと 12
export function makeMultiplier(factor: number): (n: number) => number {
  throw new Error("TODO: ここを実装してください");
}
