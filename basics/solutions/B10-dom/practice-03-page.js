// 基礎編 第10章 演習 3: 金額を足していく（画面のコード）
// practice-03.html から読み込まれます。
// 「足す」を押すと、入力欄の金額を合計に足して、表示するようにしてください。

import { addAmount } from "./practice-03.js"; // 別のファイルの関数を使うための行です。書き換えません

const amount = document.querySelector("#amount");
const button = document.querySelector("#add");
const totalText = document.querySelector("#total");

let total = 0;

// ここから下に書く
button.addEventListener("click", () => {
  total = addAmount(total, amount.value);
  totalText.textContent = `合計: ${total}円`;
});
