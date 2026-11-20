// エラー 1 の言い換え:
//   Record<Size, number> のキーは S・M・L だけなのに、XL を書いている。
// エラー 2 の言い換え:
//   pen.memo は undefined かもしれないので、string 型の変数に入れられない。
// エラー 3 の言い換え:
//   Book には Product の price も必要なのに、辞書のデータに書かれていない。

type Size = "S" | "M" | "L";
type Product = { name: string; price: number; memo?: string };
type Book = Product & { author: string };

const stock: Record<Size, number> = { S: 3, M: 5, L: 2 };

const pen: Product = { name: "ペン", price: 80 };
const memo: string | undefined = pen.memo;

const books: Book[] = [
  { name: "小説", price: 900, author: "山田" },
  { name: "辞書", price: 2500, author: "佐藤" },
];

console.log(stock, memo, books);
