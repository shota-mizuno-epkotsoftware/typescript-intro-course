const withTax = (price) => price + price / 10;
const label = (name, price) => {
  `${name}: ${price}円`;
};
const line = (name, price) => {
  const total = withTax(price);
  return `${name}: ${total}円`;
};

console.log(withTax(200));         // ①
console.log(label("ノート", 200)); // ②
console.log(line("ノート", 200));  // ③
