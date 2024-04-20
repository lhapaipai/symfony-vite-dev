import Routing from "fos-router";
import "./dep"
console.log("coucou")

function refreshStickStatus() {
  $nav.classList.toggle("stuck", document.documentElement.scrollTop > 0);
}

let $nav = document.querySelector("#nav");
if ($nav) {
  window.addEventListener("scroll", refreshStickStatus);
  refreshStickStatus();
}
console.log(Routing)

window.addEventListener("DOMContentLoaded", () => {
  const url = Routing.generate("welcome");
  const a = document.getElementById("welcome-link")
  a.href = url;
  console.log(a, url)
})