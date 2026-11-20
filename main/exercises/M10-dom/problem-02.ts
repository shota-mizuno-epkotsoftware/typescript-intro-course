// 第10章 問題 2
// npm run typecheck M10 problem-02 を実行して、このファイルの型エラーを読んでください。
// （このファイルは、どの画面からも読み込まれません。型チェックだけに使います）
// 1. それぞれのエラーが何を言っているかを、自分の言葉で下のコメント欄に書く
// 2. as を使わずに、エラーが消えるようにコードを直す
//
// エラー 1 の言い換え:
// エラー 2 の言い換え:
// エラー 3 の言い換え:

const tagInput = document.querySelector("input");
if (tagInput !== null) {
  console.log(tagInput.value); // ①
  const total: number = 100 + tagInput.value; // ②
  tagInput.addEventListener("input", (event) => {
    if (event.target !== null) {
      console.log(event.target.value); // ③
    }
  });
}

const message = document.querySelector("#message");
if (message instanceof HTMLParagraphElement) {
  console.log(message.value); // ④
}
