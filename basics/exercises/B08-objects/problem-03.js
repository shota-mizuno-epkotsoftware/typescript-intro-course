const month = {
  name: "4月",
  budget: 30000,
  entries: [
    { date: "2026-04-01", category: "食費", amount: 1200 },
    { date: "2026-04-02", category: "交通費", amount: 500 },
  ],
};

console.log(month.entries.length);      // ①
console.log(month.entries[1].category); // ②
console.log(month.entries[2]);          // ③
console.log(month.entries[2].category); // ④
