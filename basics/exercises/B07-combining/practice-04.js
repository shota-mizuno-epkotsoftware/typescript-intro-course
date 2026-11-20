// 基礎編 第7章 演習 4: 合計と支払う金額を返す
// total と payment の中を書いてください。
// 関数の名前と引数、export は書き換えません。

// 送料を返す。合計が 3000 円以上なら 0 円、それ以外は 500 円（この関数は書き換えません）
export function shippingFee(amount) {
  if (amount >= 3000) {
    return 0;
  }
  return 500;
}

// prices（金額の配列）の合計を返す
export function total(prices) {
  // ここに書く
}

// 支払う金額（合計に、送料を足したもの）を返す
export function payment(prices) {
  // ここに書く
}
