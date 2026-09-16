/* Modern Eyes Colorado — nav + photo carousel */
(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  const root = document.querySelector(".carousel");
  if (!root) return;

  const slides = Array.from(root.querySelectorAll(".carousel-slide"));
  const prev = root.querySelector(".carousel-prev");
  const next = root.querySelector(".carousel-next");
  const dotsWrap = root.querySelector(".carousel-dots");
  let index = 0;
  let timer = null;

  slides.forEach(function (_, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Show photo " + (i + 1));
    dot.addEventListener("click", function () {
      go(i);
      restart();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (slide, n) {
      slide.classList.toggle("is-active", n === index);
    });
    dots.forEach(function (dot, n) {
      dot.classList.toggle("is-active", n === index);
    });
  }

  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () {
      go(index + 1);
    }, 4500);
  }

  if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
  if (next) next.addEventListener("click", function () { go(index + 1); restart(); });

  root.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
  root.addEventListener("mouseleave", restart);

  restart();
})();
