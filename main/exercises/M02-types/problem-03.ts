// 第2章 問題 3
// npm run typecheck M02 problem-03 を実行して、このファイルの型エラーを読んでください。
// 1. それぞれのエラーが何を言っているかを、自分の言葉で下のコメント欄に書く
// 2. エラーが消えるようにコードを直す
//
// エラー 1 の言い換え:
// エラー 2 の言い換え:
// エラー 3 の言い換え:

let message = "こんにちは";
message = 100;
console.log(message);

function square(n: number): number {
  return n * n;
}
console.log(square("3"));

let total: number;
console.log(total);
