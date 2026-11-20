const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
];

let total = 0;
for (const entry of entries) {
  if (entry.category === "食費") {
    total = total + entry.amount;
  }
}
console.log(total);
