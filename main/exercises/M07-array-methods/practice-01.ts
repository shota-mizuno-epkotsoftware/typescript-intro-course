// 第7章 演習: 配列のメソッドで商品を扱う
// throw の行を書き換えて、それぞれの関数を実装してください。
// for 文は使わず、配列のメソッド（map / filter / sort）で書くこと。

export type Product = {
  name: string;
  price: number;
};

// 価格が limit 円未満の商品の、名前だけの配列を返す（元の順のまま）。
export function namesUnder(products: Product[], limit: number): string[] {
  throw new Error("TODO: ここを実装してください");
}

// 価格の安い順に並べた、新しい配列を返す。元の配列は変えないこと。
export function sortByPrice(products: Product[]): Product[] {
  throw new Error("TODO: ここを実装してください");
}

// name という名前の商品の価格だけを price に変えた、新しい配列を返す。
// ほかの商品はそのまま。元の配列と、元の商品のオブジェクトは変えないこと。
export function changePrice(products: Product[], name: string, price: number): Product[] {
  throw new Error("TODO: ここを実装してください");
}
