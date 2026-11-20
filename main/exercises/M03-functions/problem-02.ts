// 第3章 問題 2: 2 つのカウンター
// ① と ② でそれぞれ何が表示されるか予測してください。

function makeCounter() {
  let count = 0;
  return () => {
    count = count + 1;
    return count;
  };
}

const counterA = makeCounter();
const counterB = makeCounter();
counterA();
counterA();

console.log(counterA()); // ①
console.log(counterB()); // ②
