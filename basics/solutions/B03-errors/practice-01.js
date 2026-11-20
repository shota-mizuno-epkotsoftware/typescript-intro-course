// 基礎編 第3章 演習 1: SyntaxError を直す
// 解答例：値段の行に閉じる ) を足し、小計の行の終わりの " を ` に直しました。
// price と count の行は、値を変えて試したら、元に戻します。

const price = 120;
const count = 3;

console.log("品物: ノート");
console.log(`値段: ${price}円`);
console.log(`小計: ${price * count}円`);
