// 第8章 演習: モジュールを使う
// 1. shop.ts から Item 型を import type で読み込んでください。
//    import を書くまでは、Item が見つからないという型エラーが出ます。
// 2. formatPrice 関数を import し、throw の行を書き換えて、それぞれの関数を実装してください。

// 「ノート: 132円」のように、商品名と税込価格の文字列を返す。formatPrice を使うこと。
export function describeItem(item: Item): string {
  throw new Error("TODO: ここを実装してください");
}

// item に changes の内容を上書きした、新しい Item を返す。item は変えないこと。
export function applyChanges(item: Item, changes: Partial<Item>): Item {
  throw new Error("TODO: ここを実装してください");
}

// 商品名ごとに price を合計した Map を返す。
export function totalByName(items: Item[]): Map<string, number> {
  throw new Error("TODO: ここを実装してください");
}
