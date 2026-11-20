// 基礎編 第7章 演習 3: 関数を組み合わせる
// receiptLine の中を書いてください。subtotal と withTax を呼んで作ります。
// 関数の名前と引数、export は書き換えません。

// 小計（値段 × 個数）を返す
export function subtotal(price, count) {
  return price * count;
}

// 税込の金額（税率は 10%）を返す
export function withTax(amount) {
  return amount + amount * 10 / 100;
}

// 「ノート: 396円」の形の文字列を返す。金額は、小計を税込にしたもの
export function receiptLine(name, price, count) {
  const sub = subtotal(price, count);
  // ここに書く（sub を withTax に渡して、名前と合わせた文字列を返す）
}
