// 第5章 問題 3
// npm run typecheck M05 problem-03 を実行して、このファイルの型エラーを読んでください。
// 1. それぞれのエラーが何を言っているかを、自分の言葉で下のコメント欄に書く
// 2. エラーが消えるようにコードを直す
//
// エラー 1 の言い換え:
// エラー 2 の言い換え:
// エラー 3 の言い換え:

type Size = "S" | "M" | "L";
type Product = { name: string; price: number; memo?: string };
type Book = Product & { author: string };

const stock: Record<Size, number> = { S: 3, M: 5, L: 2, XL: 1 };

const pen: Product = { name: "ペン", price: 80 };
const memo: string = pen.memo;

const books: Book[] = [
  { name: "小説", price: 900, author: "山田" },
  { name: "辞書", author: "佐藤" },
];

console.log(stock, memo, books);
