// 第9章 問題 2: 表示される順番
// 表示される順番を予測してください。

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cook(name: string, ms: number): Promise<void> {
  await wait(ms);
  console.log(`${name} ができた`);
}

console.log("注文");
cook("カレー", 100);
cook("サラダ", 50);
setTimeout(() => console.log("水が届いた"), 0);
console.log("待つ");
