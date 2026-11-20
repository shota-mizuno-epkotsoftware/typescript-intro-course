// 第6章 問題 3
// npm run typecheck M06 problem-03 を実行して、このファイルの型エラーを読んでください。
// 1. それぞれのエラーが何を言っているかを、自分の言葉で下のコメント欄に書く
// 2. as や ! を使わずに、エラーが消えるようにコードを直す（shout は、text が null のとき "" を返す）
//
// エラー 1 の言い換え:
// エラー 2 の言い換え:
// エラー 3 の言い換え:

type Member = {
  name: string;
  nickname?: string;
};

const member: Member = { name: "Alice" };
console.log(member.nickname.toUpperCase());

function shout(text: string | null): string {
  return text.toUpperCase();
}
console.log(shout("hello"));

const input: unknown = JSON.parse('"42"');
console.log(input.length);
