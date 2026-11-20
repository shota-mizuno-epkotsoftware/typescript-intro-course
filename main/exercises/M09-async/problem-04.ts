// 第9章 問題 4: 繰り返しの中のエラー
// 何が表示されるか予測してください。

async function half(n: number): Promise<number> {
  if (n < 0) {
    throw new Error("負の数です");
  }
  return n / 2;
}

for (const n of [10, -4, 6]) {
  try {
    console.log(await half(n));
  } catch (e) {
    console.log("失敗しました");
  }
  console.log(`${n} は終わり`);
}
