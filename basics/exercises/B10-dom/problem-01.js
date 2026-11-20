const message = document.querySelector("#message");
const button = document.querySelector("#button");
let count = 0;

console.log("A");
button.addEventListener("click", () => {
  count = count + 1;
  console.log("B");
  message.textContent = `${count} 回押されました`;
});
console.log("C");
