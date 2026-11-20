// 基礎編 第9章 演習 1: 間違いを直す
// 解答例：2 つのコールバックの { } の中に、return を足しました。

// 金額だけの配列を返す
export function amountsOf(entries) {
  return entries.map((entry) => {
    return entry.amount;
  });
}

// 金額が 1000 円以上の記録だけの配列を返す
export function expensive(entries) {
  return entries.filter((entry) => {
    return entry.amount >= 1000;
  });
}

// 下の行は、試しに関数を呼ぶためのものです。そのまま残します。
const sample = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
];
console.log(amountsOf(sample));
console.log(expensive(sample));
