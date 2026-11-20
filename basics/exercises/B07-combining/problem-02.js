const price = 100;
let count = 0;

function show(price) {
  price = price + 50;
  console.log(price); // ①
}

function addOne() {
  count = count + 1;
}

show(300);
console.log(price); // ②
addOne();
addOne();
console.log(count); // ③
