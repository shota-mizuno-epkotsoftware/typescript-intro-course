// エラー 1 の言い換え:
//   nickname は省略できるので undefined かもしれない。そのままでは toUpperCase() を呼べない。
// エラー 2 の言い換え:
//   text は null かもしれない。そのままでは toUpperCase() を呼べない。
// エラー 3 の言い換え:
//   input は unknown なので、種類を調べるまで .length を使えない。

type Member = {
  name: string;
  nickname?: string;
};

const member: Member = { name: "Alice" };
console.log(member.nickname?.toUpperCase());

function shout(text: string | null): string {
  if (text === null) {
    return "";
  }
  return text.toUpperCase();
}
console.log(shout("hello"));

const input: unknown = JSON.parse('"42"');
if (typeof input === "string") {
  console.log(input.length);
}
