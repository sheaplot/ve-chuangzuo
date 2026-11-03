/* ve创作 — 响应式导航：小屏汉堡菜单，大屏复位
   触发方式：.nav-toggle 按钮、点击导航里的链接、按 Escape、窗口变宽。 */
(function () {
  "use strict";

  var button = document.querySelector(".nav-toggle");
  var header = button ? button.closest(".site-header") : null;
  var nav = document.getElementById("site-nav");
  if (!button || !header || !nav) return;

  function open() {
    header.classList.add("nav-open");
    button.setAttribute("aria-expanded", "true");
  }

  function close() {
    header.classList.remove("nav-open");
    button.setAttribute("aria-expanded", "false");
  }

  function toggle() {
    header.classList.contains("nav-open") ? close() : open();
  }

  button.addEventListener("click", toggle);

  nav.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (link) close();
  });

  document.addEventListener("click", function (e) {
    if (header.classList.contains("nav-open") && !header.contains(e.target)) {
      close();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("nav-open")) {
      close();
      button.focus();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 639) {
      close();
    }
  });
})();
