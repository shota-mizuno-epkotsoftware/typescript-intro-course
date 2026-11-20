// 基礎編 第5章 演習 4: いちばん安い値段を探す
// いちばん安い値段を表示してください。
// prices の行は、値を変えて試したら、元に戻します。

const prices = [1200, 800, 3000, 450];

// ここから下に書く
let min = prices[0];
for (const price of prices) {
  if (price < min) {
    min = price;
  }
}

console.log(`いちばん安い: ${min}円`);
