// 第8章 問題 1: モジュールの読み込み
// 何がどの順で表示されるか予測してください。

import { increment } from "./counter.ts";
import { first } from "./start.ts";

console.log("problem-01.ts の本体");
console.log(increment()); // ①
console.log(first); // ②
