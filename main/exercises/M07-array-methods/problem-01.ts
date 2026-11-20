// 第7章 問題 1: 在庫を探す
// ①〜④ でそれぞれ何が表示されるか予測してください。

const stocks = [
  { name: "りんご", count: 3 },
  { name: "みかん", count: 0 },
  { name: "りんご", count: 8 },
];

const apple = stocks.find((s) => s.name === "りんご");
const orange = stocks.find((s) => s.name === "みかん");
const grape = stocks.find((s) => s.name === "ぶどう");

console.log(apple?.count); // ①
console.log(orange?.count || "なし"); // ②
console.log(orange?.count ?? "なし"); // ③
console.log(grape?.count ?? "なし"); // ④
