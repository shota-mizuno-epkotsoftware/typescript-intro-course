// 第4章 問題 2: 代入した先を変える
// ① と ② でそれぞれ何が表示されるか予測してください。

const original = { name: "ノート", price: 120 };
const alias = original;
alias.price = 150;

const copy = { ...original };
copy.price = 200;

console.log(original.price); // ①
console.log(copy.price); // ②
