// 基礎編 第11章 演習 5: 家計簿の集計を表示する
// 下のデータを集計して、本文の「表示の例」と同じ形で表示するプログラムを書いてください。
// budget、limit、categories の行は、値を変えて試したら、元に戻します。entries の中身は、書き換えません。

const budget = 10000; // 今月の予算
const limit = 2000; // この金額以上の記録を「大きな支出」とする
const categories = ["食費", "交通費", "趣味"]; // 集計するカテゴリ

const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-03", category: "交通費", amount: 480 },
  { date: "2026-04-05", category: "食費", amount: 3500 },
  { date: "2026-04-10", category: "趣味", amount: 2800 },
];

// ここから下に書く
function totalOf(list, category) {
  let total = 0;
  for (const entry of list) {
    if (entry.category === category) {
      total += entry.amount;
    }
  }
  return total;
}

function totalAmount(list) {
  let total = 0;
  for (const entry of list) {
    total += entry.amount;
  }
  return total;
}

for (const category of categories) {
  console.log(`${category}: ${totalOf(entries, category)}円`);
}

const total = totalAmount(entries);
console.log(`合計: ${total}円`);
if (total <= budget) {
  console.log(`残り: ${budget - total}円`);
} else {
  console.log(`予算オーバー: ${total - budget}円`);
}

const large = [];
for (const entry of entries) {
  if (entry.amount >= limit) {
    large.push(entry);
  }
}
console.log(`大きな支出（${limit}円以上）: ${large.length}件`);
for (const entry of large) {
  console.log(`${entry.date} ${entry.category} ${entry.amount}円`);
}
