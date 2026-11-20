// 第7章 問題 3: 支払い済みの個数
// ① と ② でそれぞれ何が表示されるか予測してください。

const orders = [
  { item: "ノート", count: 2, paid: true },
  { item: "ペン", count: 5, paid: false },
  { item: "定規", count: 1, paid: true },
];

const paidCounts = orders.filter((o) => o.paid).map((o) => o.count);
const total = paidCounts.reduce((sum, count) => sum + count, 10);

console.log(paidCounts); // ①
console.log(total); // ②
