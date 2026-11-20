// 基礎編 第10章 演習 1: 間違いを直す
// このファイルには、間違いが 2 つあります。ブラウザのコンソールを見ながら直してください。
// practice-01.html は、書き換えません。

const greeting = document.querySelector("#greeting");
const button = document.querySelector("#helo");

button.addEventListener("click", () => {
  greeting.textcontent = "こんにちは";
});
