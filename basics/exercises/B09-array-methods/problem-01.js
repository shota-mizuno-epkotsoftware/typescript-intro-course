const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
];

const amounts = entries.map((entry) => entry.amount);
const labels = entries.map((entry) => `${entry.category}: ${entry.amount}円`);
const checks = amounts.map((amount) => amount >= 1000);

console.log(amounts);        // ①
console.log(labels);         // ②
console.log(checks);         // ③
console.log(amounts.length); // ④
