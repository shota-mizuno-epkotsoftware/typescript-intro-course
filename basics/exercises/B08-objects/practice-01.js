// 基礎編 第8章 演習 1: 間違いを直す
// lastEntryText は、最後の記録を「交通費: 500円」の形の文字列にして返す関数です。
// 間違いが 2 つあります。実行して、直してください。

export function lastEntryText(entries) {
  const last = entries[entries.length];
  return `${last.category}: ${last.amout}円`;
}

// 下の行は、試しに関数を呼ぶためのものです。そのまま残します。
const sample = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
];
console.log(lastEntryText(sample));
