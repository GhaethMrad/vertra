const aside = document.querySelector(".aside");
const bars = document.querySelector(".bars");
const xmark = document.querySelector(".fa-xmark");

bars.addEventListener("click", () => {
    aside.classList.add("active")
})

xmark.addEventListener("click", () => {
    aside.classList.remove("active")
})