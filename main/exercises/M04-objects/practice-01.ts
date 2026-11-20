// 第4章 演習: 元を変えずに新しく作る
// throw の行を書き換えて、それぞれの関数を実装してください。
// どの関数も、受け取ったオブジェクトや配列を書き換えてはいけません。

// 末尾に tag を足した、新しい配列を返す。
export function addTag(tags: string[], tag: string): string[] {
  throw new Error("TODO: ここを実装してください");
}

// 商品の価格だけを変えた、新しいオブジェクトを返す。
export function withPrice(item: { name: string; price: number }, price: number): { name: string; price: number } {
  throw new Error("TODO: ここを実装してください");
}

// 住所の city だけを変えた、新しいオブジェクトを返す。address の中も新しく作ること。
export function withCity(
  user: { name: string; address: { city: string; zip: string } },
  city: string,
): { name: string; address: { city: string; zip: string } } {
  throw new Error("TODO: ここを実装してください");
}
