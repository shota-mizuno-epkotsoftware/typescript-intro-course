// 第4章 問題 1: 順番を入れ替える
// ①〜③ でそれぞれ何が表示されるか予測してください。

const defaults = { size: "M", color: "黒" };
const custom = { color: "赤" };

const first = { ...defaults, ...custom };
const second = { ...custom, ...defaults, size: "L" };
const { size, color } = second;

console.log(first.color); // ①
console.log(color); // ②
console.log(size); // ③
