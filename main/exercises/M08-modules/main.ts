import type { Item } from "./shop.ts"; // 型は import type で読み込む
import { formatPrice } from "./shop.ts"; // 関数は import で読み込む

const note: Item = { name: "ノート", price: 120 };
console.log(formatPrice(note.price)); // → 132円
