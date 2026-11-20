// 基礎編 第6章 演習 2: 税込の金額を返す
// ____ を書き換えて、関数を完成させてください。
// 関数の名前と引数、export は書き換えません。

// 税込の金額を返す。price は税抜きの金額、taxPercent は税率（%）
export function withTax(price, taxPercent) {
  const tax = price * taxPercent / 100;
  return price + tax;
}
