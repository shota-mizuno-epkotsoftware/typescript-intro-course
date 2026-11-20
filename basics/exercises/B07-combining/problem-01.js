function subtotal(price, count) {
  return price * count;
}

function shippingFee(amount) {
  if (amount >= 3000) {
    return 0;
  }
  return 500;
}

function payment(price, count) {
  const amount = subtotal(price, count);
  return amount + shippingFee(amount);
}

console.log(payment(1200, 2)); // ①
console.log(payment(1000, 3)); // ②
