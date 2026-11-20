// 基礎編 第4章 演習 4: 予算内かどうかを表示する
// 使った金額が予算以下なら「予算内です」と残りを、予算を超えたら「予算オーバーです」と超えた金額を表示してください。
// budget と spent の行は、値を変えて試したら、元に戻します。

const budget = 30000; // 予算
const spent = 32500;  // 使った金額

// ここから下に書く
if (spent <= budget) {
  console.log("予算内です");
  console.log(`残り: ${budget - spent}円`);
} else {
  console.log("予算オーバーです");
  console.log(`超えた金額: ${spent - budget}円`);
}
