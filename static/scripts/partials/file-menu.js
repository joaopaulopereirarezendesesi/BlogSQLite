document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  const button = menu.querySelector("button");

  button.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
});
