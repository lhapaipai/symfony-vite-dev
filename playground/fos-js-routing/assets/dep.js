import Routing from "fos-router";


window.addEventListener("DOMContentLoaded", () => {
  const url = Routing.generate("other");
  const a = document.getElementById("other-link")
  a.href = url;
  console.log(a, url)
})