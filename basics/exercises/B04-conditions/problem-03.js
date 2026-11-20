const total = 2500;
const isMember = true;

console.log(total >= 3000 && isMember); // ①
console.log(total >= 3000 || isMember); // ②
console.log(!isMember);                 // ③

if (total >= 1000 && total < 3000) {
  console.log("1000 円以上、3000 円未満です"); // ④
}
