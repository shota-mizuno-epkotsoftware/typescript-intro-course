// 基礎編 第9章 演習 4: 日付で探す
// 日付が date と同じ記録を find で探して、その金額を返す関数を書いてください。見つからないときは、0 を返します。

export function amountOn(entries, date) {
  const found = entries.find((entry) => entry.date === date);
  if (found === undefined) {
    return 0;
  }
  return found.amount;
}
