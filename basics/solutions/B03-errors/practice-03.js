// 基礎編 第3章 演習 3: 結果が違うプログラムを直す
// 解答例：小計を unit で計算するように直し、送料の "500" を数値の 500 に直しました。
// price、count、discount の行は、値を変えて試したら、元に戻します。

const price = 1500;   // 1 個の値段
const count = 2;      // 個数
const discount = 200; // 1 個あたりの値引き

const unit = price - discount; // 値引きした後の、1 個の値段
let total = unit * count;      // 値引きした後の値段で、小計を計算する
total = total + 500;           // 送料の 500 円を足す
console.log(`合計: ${total}円`);
