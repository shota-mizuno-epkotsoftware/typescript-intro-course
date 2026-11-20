// 基礎編 第10章 演習 2: カウンターを作る
// 「1 増やす」を押すと数が 1 増え、「0 に戻す」を押すと 0 に戻るようにしてください。
// practice-02.html は、書き換えません。

const countText = document.querySelector("#count");
const plusButton = document.querySelector("#plus");
const resetButton = document.querySelector("#reset");

let count = 0;

// ここから下に書く
plusButton.addEventListener("click", () => {
  count = count + 1;
  countText.textContent = count;
});

resetButton.addEventListener("click", () => {
  count = 0;
  countText.textContent = count;
});
