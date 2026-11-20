// 基礎編 第7章 演習 2: アロー関数を書く
// 1〜3 は、____ を書き換えてください。4 は、関数をアロー関数に書き換えてください。
// 関数の名前は書き換えません。export は、4 を書き換えた後も残します。

// 1. n を 2 倍にした数を返す
export const double = (n) => n * 2;

// 2. 税込の金額を返す
export const withTax = (price, taxPercent) => price + price * taxPercent / 100;

// 3. a と b のうち、大きいほうを返す
export const larger = (a, b) => {
  if (a >= b) {
    return a;
  }
  return b;
};

// 4. n を半分にした数を返す（export const half = ... の形の、アロー関数に書き換える）
export const half = (n) => n / 2;
