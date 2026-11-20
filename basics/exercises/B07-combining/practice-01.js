// 基礎編 第7章 演習 1: 間違いを直す
// 2 つの関数に、間違いが 1 つずつあります。直してください。
// 関数の名前と引数、export は書き換えません。

// 小計（値段 × 個数）を返す
export function subtotal(price, count) {
  const amount = price * count;
}

// 支払う金額（小計に、送料の 500 円を足したもの）を返す
export function payment(price, count) {
  subtotal(price, count);
  return amount + 500;
}
