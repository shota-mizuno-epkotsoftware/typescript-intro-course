// 第6章 問題 2: as と !
// (1) エディタで見たとき、このファイルに型エラー（赤い波線）は出るか予測してください。
// (2) node で実行すると、①〜④ でそれぞれ何が起きるか予測してください。

type Product = {
  name: string;
  price: number;
  tags?: string[];
};

const data: unknown = JSON.parse('{"name": "ペン", "price": "80"}');
const product = data as Product;

console.log(product.name); // ①
console.log(product.price === 80); // ②
console.log(product.tags!.length); // ③
console.log("終わり"); // ④
