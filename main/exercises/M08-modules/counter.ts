// 第8章 問題 1 で読み込まれるファイル（書き換えないでください）
console.log("counter.ts の本体");

let count = 0;

export function increment(): number {
  count = count + 1;
  return count;
}
