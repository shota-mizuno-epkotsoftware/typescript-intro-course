const price = 800;
const count = 3;
const coupon = 500;

let total = price * count;
total = price - coupon;
console.log(`合計: ${total}円`);
