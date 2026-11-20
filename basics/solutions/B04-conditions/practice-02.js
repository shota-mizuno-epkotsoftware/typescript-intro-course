// 基礎編 第4章 演習 2: 送料を決める
// 合計が 3000 円以上か、会員なら、送料は 0 円です。それ以外は 500 円です。
// ____ を書き換えてください。total と isMember の行は、値を変えて試したら、元に戻します。

const total = 2800;     // 買い物の合計
const isMember = false; // 会員なら true

let shipping = 500;
if (total >= 3000 || isMember) {
  shipping = 0;
}

console.log(`送料: ${shipping}円`);
console.log(`支払い: ${total + shipping}円`);
