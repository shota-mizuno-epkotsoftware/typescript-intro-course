// 第10章 演習（2）: 画面を作る
// practice-01.html から読み込まれます。npm run dev M10 で開いて確かめます。
// 解答例：render 関数で、一覧を expenses から作り直す。

import { formatLine, formatYen, parseExpense, sumAmounts } from "./practice-01.ts";
import type { Expense } from "./practice-01.ts";

const form = document.querySelector("#expense-form");
const nameInput = document.querySelector("#name");
const amountInput = document.querySelector("#amount");
const list = document.querySelector("#list");
const totalText = document.querySelector("#total");
const errorText = document.querySelector("#error");

if (
  !(form instanceof HTMLFormElement) ||
  !(nameInput instanceof HTMLInputElement) ||
  !(amountInput instanceof HTMLInputElement) ||
  list === null ||
  totalText === null ||
  errorText === null
) {
  throw new Error("画面の要素が見つかりません");
}

// 画面の状態。画面はいつも、この配列から作り直す。
let expenses: Expense[] = [];

// 状態（expenses）から、一覧と合計を作り直す
const render = () => {
  list.replaceChildren();
  for (const expense of expenses) {
    const item = document.createElement("li");
    item.textContent = formatLine(expense);
    list.append(item);
  }

  totalText.textContent = `合計 ${formatYen(sumAmounts(expenses))}`;
};

form.addEventListener("submit", (event) => {
  event.preventDefault(); // フォームを送信して、ページが読み込み直されるのを止める

  const result = parseExpense(nameInput.value, amountInput.value);
  if (typeof result === "string") {
    errorText.textContent = result;
    return;
  }

  errorText.textContent = "";
  expenses = [...expenses, result];
  form.reset(); // 入力欄を空に戻す
  render();
});

render();
