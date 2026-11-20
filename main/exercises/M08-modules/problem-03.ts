// 第8章 問題 3
// npm run typecheck M08 problem-03 を実行して、このファイルの型エラーを読んでください。
// 1. それぞれのエラーが何を言っているかを、自分の言葉で下のコメント欄に書く
// 2. shop.ts は変えずに、エラーが消えるようにこのファイルを直す
//
// エラー 1 の言い換え:
// エラー 2 の言い換え:
// エラー 3 の言い換え:

import type { Item, formatPrice } from "./shop.ts";

const prices = new Map<string, number>();
prices.set("箱", 300);
console.log(formatPrice(prices.get("箱")));

const draft: Partial<Item> = { name: "箱" };
const item: Item = draft;
console.log(item.name);
