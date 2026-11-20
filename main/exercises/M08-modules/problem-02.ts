// 第8章 問題 2: Map で数える
// ①〜③ でそれぞれ何が表示されるか予測してください。

const points = new Map<string, number>();
points.set("赤", 5);

for (const team of ["赤", "青", "赤"]) {
  points.set(team, (points.get(team) ?? 0) + 1);
}
points.set("青", 10);

console.log(points.get("赤")); // ①
console.log(points.get("青")); // ②
console.log(points.size); // ③
