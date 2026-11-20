// 第10章 演習（2）: 画面を作る
// practice-01.html から読み込まれます。npm run dev M10 で開いて確かめます。
// 下の render 関数の TODO を書いてください。それ以外の部分は、読んで流れを確かめてください。

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
  // TODO: 一覧（list）の中身を、expenses から作り直してください。
  //   1. list.replaceChildren() で、今の中身を空にする
  //   2. expenses の 1 件ごとに <li> 要素を作り、文字を formatLine(expense) で作って、list に追加する

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
