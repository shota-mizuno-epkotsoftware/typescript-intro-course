const amount = document.querySelector("#amount");
const button = document.querySelector("#add");
const result = document.querySelector("#result");

button.addEventListener("click", () => {
  result.textContent = amount.value + 20;
});
