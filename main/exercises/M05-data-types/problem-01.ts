// 第5章 問題 1: 変数に入れたサイズを渡す
// (1) エディタで見たとき、① と ② のそれぞれに型エラー（赤い波線）が出るか予測してください。
// (2) node で実行すると、何が表示されるか予測してください。
// (3) 答えを読んだ後、型エラーがあれば、答えの最後の手順で直してください。

type Size = "S" | "M" | "L";

function printSize(size: Size): void {
  console.log(`サイズ ${size}`);
}

function printText(text: string): void {
  console.log(`文字 ${text}`);
}

let input = "S";
const copy = input;
const large: Size = "L";

printSize(copy); // ①
printText(large); // ②
