// 基礎編 第9章 演習 3: カテゴリの金額を並べる
// カテゴリが category と同じ記録の、金額だけの配列を返す関数を書いてください。
// 関数の名前と引数、export は書き換えません。

export function amountsOfCategory(entries, category) {
  return entries
    .filter() // ここに書く（カテゴリが category と同じかを調べるコールバック）
    .map(); // ここに書く（金額を取り出すコールバック）
}
