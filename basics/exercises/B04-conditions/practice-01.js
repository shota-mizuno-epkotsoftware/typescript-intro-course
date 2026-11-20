// 基礎編 第4章 演習 1: 間違いを直す
// このファイルには、間違いが 2 つあります。実行して、エラーを読んで直してください。
// category と amount の行は、値を変えて試したら、元に戻します。

const category = "食費";
const amount = 1200;

if (category = "交通費") {
  console.log("交通費の記録です");
}
if (category !== "交通費") {
  console.log("交通費以外の記録です");

console.log(`${category}: ${amount}円`);
