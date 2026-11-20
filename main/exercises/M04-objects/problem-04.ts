// 第4章 問題 4: 中の配列
// (1) ① と ② でそれぞれ何が表示されるか予測してください。
// (2) 答えを読んだら、答えの手順に沿って next を作る行を直してください。

const order = { id: 1, items: ["ペン"] };
const next = { ...order, id: 2 };
const added = { ...order, items: [...order.items, "ノート"] };

next.items.push("消しゴム");

console.log(order.items); // ①
console.log(added.items); // ②
