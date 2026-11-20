// エラー 1 の言い換え:
//   message は最初に文字列を入れたので string 型と推論された。そこに数値は入れられない。
// エラー 2 の言い換え:
//   square の引数は number 型なのに、文字列 "3" を渡している。
// エラー 3 の言い換え:
//   total に値を入れる前に使おうとしている。

let message = "こんにちは";
message = "100"; // 文字列を代入する（数値を入れたいなら別の変数にする）
console.log(message);

function square(n: number): number {
  return n * n;
}
console.log(square(3));

let total = 0; // 使う前に初期値を入れる
console.log(total);
