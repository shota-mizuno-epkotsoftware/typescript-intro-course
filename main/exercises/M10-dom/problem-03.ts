// 第10章 問題 3: 状態から一覧を作る
// problem-03.html から読み込まれます。

const addButton = document.querySelector("#add");
const list = document.querySelector("#list");

let names: string[] = [];

const render = () => {
  for (const name of names) {
    const item = document.createElement("li");
    item.textContent = name;
    list?.append(item);
  }
};

addButton?.addEventListener("click", () => {
  names = [...names, `項目${names.length + 1}`];
  render();
});
