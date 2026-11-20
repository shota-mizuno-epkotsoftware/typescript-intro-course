// 基礎編 第3章 演習 2: ReferenceError と TypeError を直す
// 解答例：subtotal の宣言を表示の行の上へ移し、Price を price に、console.lg を console.log に直しました。
// price と count の行は、値を変えて試したら、元に戻します。

const price = 450;
const count = 4;

const subtotal = price * count;
console.log(`小計: ${subtotal}円`);
console.log(`送料込み: ${subtotal + 500}円`);
