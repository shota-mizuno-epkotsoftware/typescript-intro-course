const entries = [
  { date: "2026-04-01", category: "食費", amount: 1200 },
  { date: "2026-04-02", category: "交通費", amount: 500 },
  { date: "2026-04-03", category: "食費", amount: 800 },
];

const foodList = entries.filter((entry) => entry.category === "食費");
const food = entries.find((entry) => entry.category === "食費");
const hobbyList = entries.filter((entry) => entry.category === "趣味");
const hobby = entries.find((entry) => entry.category === "趣味");

console.log(foodList.length); // ①
console.log(food.amount);     // ②
console.log(hobbyList);       // ③
console.log(hobby);           // ④
