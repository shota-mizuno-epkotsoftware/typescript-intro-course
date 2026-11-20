// 基礎編 第10章 演習 3: 金額を足していく（計算の関数）
// 今の合計 total に、入力欄の文字列 text を数値に変えて足した結果を返す。
// text が数値に変えられないときは、total をそのまま返す。
// 例: addAmount(1000, "500") は 1500、addAmount(1000, "abc") は 1000

export function addAmount(total, text) {
  const amount = Number(text);
  if (Number.isNaN(amount)) {
    return total;
  }
  return total + amount;
}
