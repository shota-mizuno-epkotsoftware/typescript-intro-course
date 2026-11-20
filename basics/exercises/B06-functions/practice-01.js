// 基礎編 第6章 演習 1: 間違いを直す
// 2 つの関数に、間違いが 1 つずつあります。直してください。
// 関数の名前と引数、export は書き換えません。

// 小計（値段 × 個数）を返す
export function subtotal(price, count) {
  price * count;
}

// 送料を返す。合計が 3000 円以上なら 0 円、それ以外は 500 円
export function shippingFee(total) {
  if (total >= 3000) {
    return 0;
  }
  console.log(500);
}
