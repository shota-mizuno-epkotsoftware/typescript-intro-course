// エラー 1 の言い換え:
//   formatPrice を import type で読み込んだので、実行時には消える。関数として呼べない。
// エラー 2 の言い換え:
//   Map の get の戻り値は number | undefined。number しか受け取らない formatPrice には渡せない。
// エラー 3 の言い換え:
//   Partial<Item> の name は string | undefined なので、name が必ず string の Item には入れられない。

import type { Item } from "./shop.ts";
import { formatPrice } from "./shop.ts";

const prices = new Map<string, number>();
prices.set("箱", 300);
console.log(formatPrice(prices.get("箱") ?? 0));

const draft: Partial<Item> = { name: "箱" };
const item: Item = { name: "名前なし", price: 0, ...draft };
console.log(item.name);
