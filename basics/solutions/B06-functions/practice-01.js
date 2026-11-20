// 基礎編 第6章 演習 1: 間違いを直す
// 解答例：subtotal の計算の前に return を足し、shippingFee の console.log(500); を return 500; に直しました。
// 関数の名前と引数、export は書き換えません。

// 小計（値段 × 個数）を返す
export function subtotal(price, count) {
  return price * count;
}

// 送料を返す。合計が 3000 円以上なら 0 円、それ以外は 500 円
export function shippingFee(total) {
  if (total >= 3000) {
    return 0;
  }
  return 500;
}
