// 基礎編 第2章 演習 1: 間違いを直す
// 解答例：total の宣言を const から let に変え、表示の行の totla を total に直しました。
// price と count の行は、値を変えて試したら、元に戻します。

const price = 1200;
const count = 2;

let total = price * count;
total = total - 300; // 300 円引きのクーポンを使う
console.log(`合計: ${total}円`);
