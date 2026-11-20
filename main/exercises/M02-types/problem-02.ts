// 第2章 問題 2: 外から来た注文データ
// 何が表示されるか予測してください。

function addShipping(price: number): number {
  return price + 500;
}

const order = JSON.parse('{"item": "本", "price": "1000"}');

console.log(addShipping(order.price));
