// 第5章 問題 1 の修正例

type Size = "S" | "M" | "L";

function printSize(size: Size): void {
  console.log(`サイズ ${size}`);
}

function printText(text: string): void {
  console.log(`文字 ${text}`);
}

const input = "S"; // let を const に変えると、input も copy も型は "S" になる
const copy = input;
const large: Size = "L";

printSize(copy); // ①
printText(large); // ②
