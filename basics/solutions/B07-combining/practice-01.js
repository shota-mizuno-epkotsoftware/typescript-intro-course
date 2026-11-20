// 基礎編 第7章 演習 1: 間違いを直す
// 解答例：subtotal に return amount; を足し、payment で subtotal の戻り値を変数 amount に入れるように直しました。
// 関数の名前と引数、export は書き換えません。

// 小計（値段 × 個数）を返す
export function subtotal(price, count) {
  const amount = price * count;
  return amount;
}

// 支払う金額（小計に、送料の 500 円を足したもの）を返す
export function payment(price, count) {
  const amount = subtotal(price, count);
  return amount + 500;
}
