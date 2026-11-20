// 第10章 問題 1: 画面の要素を取得し、イベントを登録する
// problem-01.html から読み込まれます。

const priceInput = document.querySelector("#price") as HTMLInputElement;
const addButton = document.querySelector("#add") as HTMLButtonElement;
const resultText = document.querySelector("#result") as HTMLParagraphElement;

let count = 0;

addButton.addEventListener("click", () => {
  count = count + 1;
  resultText.textContent = `${Number(priceInput.value + 300)}円`;
});

console.log(count);
