// 基礎編 第5章 演習 1: 間違いを直す
// 解答例：let total = 0; を繰り返しの前へ移し、最後の要素の番号を length - 1 に直しました。
// prices の行は、値を変えて試したら、元に戻します。

const prices = [1200, 800, 3000];

let total = 0;
for (const price of prices) {
  total = total + price;
}

console.log(`合計: ${total}円`);
console.log(`最後: ${prices[prices.length - 1]}円`);
