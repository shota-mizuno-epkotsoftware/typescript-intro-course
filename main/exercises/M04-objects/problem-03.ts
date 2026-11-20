// 第4章 問題 3: 関数の中で作る、変える
// ① と ② でそれぞれ何が表示されるか予測してください。

function applySale(item: { name: string; price: number }) {
  const sale = { ...item, price: 100 };
  item.name = "セール品";
  return sale;
}

const pen = { name: "ペン", price: 150 };
const result = applySale(pen);

console.log(pen); // ①
console.log(result); // ②
