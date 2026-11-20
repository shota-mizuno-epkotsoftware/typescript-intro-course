// 第9章 問題 3: 呼び出す側の await
// 表示される順番を予測してください。

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function step(name: string): Promise<void> {
  console.log(`${name} 開始`);
  await wait(50);
  console.log(`${name} 完了`);
}

await step("A");
step("B");
console.log("終わり");
