// 第9章 問題 1: await を付けるかどうか
// ①〜③ でそれぞれ何が表示されるか予測してください。

async function getPrice(): Promise<number> {
  return 500;
}

async function getDouble(): Promise<number> {
  const price = await getPrice();
  return price * 2;
}

const a = getDouble();
const b = await getDouble();

console.log(typeof a); // ①
console.log(typeof b); // ②
console.log(b + 1);    // ③
