function subtotal(price, count) {
  return price * count;
}

function discount(amount) {
  if (amount >= 1000) {
    return amount - 100;
  }
  return amount;
}

const a = subtotal(300, 2);
const b = discount(a);
const c = discount(subtotal(400, 3)) + discount(500);
console.log(a); // ①
console.log(b); // ②
console.log(c); // ③
