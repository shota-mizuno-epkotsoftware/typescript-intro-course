// 第9章 演習: ファイルの数値を合計して報告する
// throw の行を書き換えて、それぞれの関数を実装してください。

import { readFile } from "node:fs/promises";

// path のファイルには、1 行に 1 つずつ数値が書かれている。その合計を返す。
// 例: numbers.txt の合計は 600
export async function sumFile(path: string): Promise<number> {
  throw new Error("TODO: ここを実装してください");
}

// sumFile を呼び、成功したら「合計: 600」の形の文字列を返す。
// 失敗したら、Error なら「読み込めません: エラーのメッセージ」を、そうでなければ「不明なエラー」を返す。
export async function reportFile(path: string): Promise<string> {
  throw new Error("TODO: ここを実装してください");
}
