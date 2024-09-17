function refreshStickStatus() {
  $nav.classList.toggle("stuck", document.documentElement.scrollTop > 0);
}

let $nav = document.querySelector("#nav");
if ($nav) {
  window.addEventListener("scroll", refreshStickStatus);
  refreshStickStatus();
}
