// 基礎編 第10章 演習 1: 間違いを直す
// 解答例：#helo を #hello に直し、textcontent を textContent に直しました。
// practice-01.html は、書き換えません。

const greeting = document.querySelector("#greeting");
const button = document.querySelector("#hello");

button.addEventListener("click", () => {
  greeting.textContent = "こんにちは";
});
