// 基礎編 第8章 演習 3: 記録を作る・書き換える
// 2 つの関数の中を書いて、完成させてください。
// 関数の名前と引数、export は書き換えません。

// 日付・カテゴリ・金額を受け取り、記録のオブジェクトを作って返す
export function makeEntry(date, category, amount) {
  return {
    date: date,
    // ここに書く（category と amount のプロパティ）
    category: category,
    amount: amount,
  };
}

// 記録の金額を amount に入れ直してから、その記録を返す
export function changeAmount(entry, amount) {
  // ここに書く（entry の金額を入れ直す行）
  entry.amount = amount;
  return entry;
}
