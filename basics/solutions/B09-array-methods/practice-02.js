// 基礎編 第9章 演習 2: メソッドを選ぶ
// ____ を書き換えて、2 つの関数を完成させてください。

// 「食費: 1200円」の形の文字列の配列を返す
export function labels(entries) {
  return entries.map((entry) => `${entry.category}: ${entry.amount}円`);
}

// 金額が limit 円以上の記録だけの配列を返す
export function over(entries, limit) {
  return entries.filter((entry) => entry.amount >= limit);
}
