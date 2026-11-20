// 第7章 問題 4: 更新した配列を使う
// ①〜③ でそれぞれ何が表示されるか予測してください。

const tasks = [
  { id: 1, title: "買い物", done: false },
  { id: 2, title: "掃除", done: false },
  { id: 3, title: "洗濯", done: true },
];

const updated = tasks.map((t) => (t.id === 2 ? { ...t, done: true } : t));
const remaining = updated.filter((t) => !t.done);

console.log(remaining.map((t) => t.title)); // ①
console.log(tasks.filter((t) => !t.done).length); // ②
console.log(updated[0] === tasks[0]); // ③
