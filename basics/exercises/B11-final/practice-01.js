// 基礎編 第11章 演習 1: 間違いを直す
// 食費の合計と、記録の件数を表示するプログラムです。間違いが 3 つあります。
// budget の行は、値を変えて試したら、元に戻します。entries の中身は、書き換えません。

const budget = 10000; // 今月の予算

const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-03", category: "交通費", amount: 480 },
  { date: "2026-04-05", category: "食費", amount: 3500 },
  { date: "2026-04-10", category: "趣味", amount: 2800 },
];

function totalOf(list, category) {
  const total = 0;
  for (const entry of list) {
    if (entry.category === category) {
      total += entry.amount;
    }
  }
  return total;
}

const food = totalOf(entries, "食費");
console.log(`食費: ${food}円`);
console.log(`記録: ${entries.lenght}件`);

if (food > budget / 2) {
  console.log("食費が予算の半分を超えています");
} else {
  console.log("食費は予算の半分以内です";
}
