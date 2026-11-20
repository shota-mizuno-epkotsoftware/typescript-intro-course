// 第8章 問題 3 と第8章 演習 で使うファイル（書き換えないでください）

export type Item = {
  name: string;
  price: number;
};

const taxRate = 0.1;

// 税込価格を「132円」の形にする
export function formatPrice(price: number): string {
  return `${Math.round(price * (1 + taxRate))}円`;
}
