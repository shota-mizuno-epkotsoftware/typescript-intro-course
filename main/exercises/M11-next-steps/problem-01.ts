// 第11章 問題 1: JSON の文字列にして、元に戻す
// ①〜③ でそれぞれ何が表示されるか予測してください。

const memos = [{ text: "牛乳", count: 2 }];

const saved = JSON.stringify(memos);
memos[0].count = 5;
const loaded = JSON.parse(saved);

console.log(typeof saved); // ①
console.log(loaded[0].count); // ②
console.log(loaded[0] === memos[0]); // ③
