import { exercise } from "../../lib/check.js";

const t = exercise(import.meta.url);
t.output("そのまま実行する", [
  "食費: 4700円",
  "交通費: 480円",
  "趣味: 2800円",
  "合計: 7980円",
  "残り: 2020円",
  "大きな支出（2000円以上）: 2件",
  "2026-04-05 食費 3500円",
  "2026-04-10 趣味 2800円",
]);
t.output(
  "答え合わせが budget を 7000、limit を 1200 に変えた場合",
  [
    "食費: 4700円",
    "交通費: 480円",
    "趣味: 2800円",
    "合計: 7980円",
    "予算オーバー: 980円",
    "大きな支出（1200円以上）: 3件",
    "2026-04-01 食費 1200円",
    "2026-04-05 食費 3500円",
    "2026-04-10 趣味 2800円",
  ],
  { budget: 7000, limit: 1200 },
);
t.output(
  "答え合わせが budget を 7980、limit を 5000、categories を [\"趣味\", \"食費\"] に変えた場合",
  ["趣味: 2800円", "食費: 4700円", "合計: 7980円", "残り: 0円", "大きな支出（5000円以上）: 0件"],
  { budget: 7980, limit: 5000, categories: ["趣味", "食費"] },
);
t.avoids("金額を直接書かない", /\b(4700|7980|2020)\b/, "4700、7980、2020 を直接書かずに、entries から計算させてください。");
// 名前を付けた関数（function 名前(...) か、const 名前 = (...) => の形）のうち、どこかで呼ばれているものを数える。
// t.uses は pattern.test(空白とコメントを除いたコード) を呼ぶので、test を持つオブジェクトを渡している。
// 日本語の名前も数える。filter や map に渡した、名前のない関数は数えない。
const namedFunctions = {
  test(code) {
    const count = (text) => code.split(text).length - 1;
    const declared = [...code.matchAll(/function([^\s(=]+)\(/g)].map((match) => match[1]);
    const arrows = [...code.matchAll(/(?:const|let)([^\s(=]+)=(?:\([^)]*\)|[^\s(=]+)=>/g)].map((match) => match[1]);
    // function 宣言は、宣言そのものも「名前(」の形なので、2 回以上出ていれば呼ばれている
    const called = [...declared.filter((name) => count(`${name}(`) >= 2), ...arrows.filter((name) => count(`${name}(`) >= 1)];
    return called.length >= 2;
  },
};
t.uses(
  "名前を付けた関数を 2 つ以上作って、呼ぶ",
  namedFunctions,
  "名前を付けた関数（function 名前(...)、または const 名前 = (...) =>）を 2 つ以上作り、それを呼んで計算してください（「守ること」の 1 つ目）。filter や map に渡す関数は、数に入りません。",
);
t.uses("push を使う", /\.push\(/, "「大きな支出」の記録を、push で配列に集めてください（「守ること」の 2 つ目）。");
t.done();
