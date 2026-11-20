// 基礎編 第5章 演習 1: 間違いを直す
// このファイルには、間違いが 2 つあります。実行して、直してください。
// prices の行は、値を変えて試したら、元に戻します。

const prices = [1200, 800, 3000];

for (const price of prices) {
  let total = 0;
  total = total + price;
}

console.log(`合計: ${total}円`);
console.log(`最後: ${prices[prices.length]}円`);
