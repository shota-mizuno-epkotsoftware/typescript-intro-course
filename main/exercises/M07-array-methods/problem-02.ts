// 第7章 問題 2: 関数の中で並べ替える
// ①〜③ でそれぞれ何が表示されるか予測してください。

function highest(values: number[]): number {
  const sorted = values.sort((a, b) => b - a);
  return sorted[0];
}

const scores = [40, 100, 70];

console.log(highest(scores)); // ①
console.log(scores); // ②
console.log([...scores].sort()); // ③
