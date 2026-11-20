// 第3章 問題 1: {} と return
// ①〜③ でそれぞれ何が表示されるか予測してください。

const half = (n: number) => n / 2;
const quarter = (n: number) => {
  const result = n / 4;
};
const label = (n: number) => {
  half(n);
  return `${n}円`;
};

console.log(half(8) + 1); // ①
console.log(quarter(8)); // ②
console.log(label(50)); // ③
