// 第11章 演習（2）: 画面を作る
// practice-01.html から読み込まれます。npm run dev M11 で開いて確かめます。

import { parseMemos, removeMemo } from "./practice-01.ts";
import type { Memo } from "./practice-01.ts";

const STORAGE_KEY = "ts-lecture:memos";

const form = document.querySelector("#memo-form");
const input = document.querySelector("#memo-text");
const list = document.querySelector("#memo-list");
const emptyText = document.querySelector("#empty");

if (
  !(form instanceof HTMLFormElement) ||
  !(input instanceof HTMLInputElement) ||
  list === null ||
  emptyText === null
) {
  throw new Error("画面の要素が見つかりません");
}

// 画面の状態。最初は、保存してあるメモを読み込む。
let memos: Memo[] = parseMemos(localStorage.getItem(STORAGE_KEY));

// 今のメモをブラウザに保存する
const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
};

// 状態（memos）から、一覧を作り直す
const render = () => {
  list.replaceChildren();
  for (const memo of memos) {
    const item = document.createElement("li");
    item.textContent = memo.text;

    const button = document.createElement("button");
    button.textContent = "削除";
    button.dataset.id = memo.id; // どのメモのボタンかを覚えておく

    item.append(button);
    list.append(item);
  }
  emptyText.classList.toggle("hidden", memos.length > 0);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (text === "") {
    return;
  }
  // crypto.randomUUID() は、メモを区別するための、ほかと重ならない文字列を作る
  memos = [...memos, { id: crypto.randomUUID(), text }];
  save();
  form.reset();
  render();
});

// 一覧全体でクリックを受ける
list.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }
  const id = event.target.dataset.id;
  if (id === undefined) {
    return;
  }
  memos = removeMemo(memos, id);
  save();
  render();
});

render();
