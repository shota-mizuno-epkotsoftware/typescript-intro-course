const tagInput = document.querySelector("input");
if (tagInput !== null) {
  console.log(tagInput.value); // ①
  const total: number = 100 + Number(tagInput.value); // ②
  tagInput.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement) {
      console.log(event.target.value); // ③
    }
  });
}

const message = document.querySelector("#message");
if (message instanceof HTMLParagraphElement) {
  console.log(message.textContent); // ④
}
