// 基礎編 第2章 演習 2: 税込の金額を計算する
// ____ を、変数の名前に書き換えてください。
// price と taxPercent の行は、値を変えて試したら、元に戻します。

const price = 800;     // 税抜きの金額
const taxPercent = 10; // 税率（%）

const tax = price * taxPercent / 100;
const total = price + tax;

console.log(`税: ${tax}円`);
console.log(`税込: ${total}円`);
