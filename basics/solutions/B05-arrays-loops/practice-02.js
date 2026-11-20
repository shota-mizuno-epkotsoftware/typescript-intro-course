// 基礎編 第5章 演習 2: 合計を計算する
// ____ を書き換えて、金額の合計を表示するプログラムにしてください。
// amounts の行は、値を変えて試したら、元に戻します。

const amounts = [1200, 800, 3000, 450];

let total = 0;
for (const amount of amounts) {
  total = total + amount;
}

console.log(`合計: ${total}円`);
