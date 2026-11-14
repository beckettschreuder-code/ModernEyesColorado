/* Modern Eyes Colorado — nav + hero photo slideshow */
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

  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("nav-open") && !nav.contains(e.target) && !toggle.contains(e.target)) {
        setMenu(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  // Open a service when linked directly (e.g. services.html#contacts)
  function openFromHash() {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.tagName === "DETAILS") target.open = true;
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  if (!slides.length) return;

  const prev = hero.querySelector(".hero-prev");
  const next = hero.querySelector(".hero-next");
  const dotsWrap = hero.querySelector(".hero-dots");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = null;
  let paused = false;

  slides.forEach(function (_, i) {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", "Show photo " + (i + 1) + " of " + slides.length);
    if (i === 0) dot.setAttribute("aria-current", "true");
    dot.addEventListener("click", function () {
      go(i);
      restart();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.querySelectorAll(".hero-dot"));

  function go(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (slide, n) {
      slide.classList.toggle("is-active", n === index);
    });
    dots.forEach(function (dot, n) {
      dot.classList.toggle("is-active", n === index);
      if (n === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    if (reduceMotion || paused || document.hidden) return;
    timer = setInterval(function () {
      go(index + 1);
    }, 5000);
  }

  if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
  if (next) next.addEventListener("click", function () { go(index + 1); restart(); });

  // Pause while the mouse or keyboard focus is in the hero
  hero.addEventListener("mouseenter", function () { paused = true; stop(); });
  hero.addEventListener("mouseleave", function () { paused = false; restart(); });
  hero.addEventListener("focusin", function () { paused = true; stop(); });
  hero.addEventListener("focusout", function () { paused = false; restart(); });
  document.addEventListener("visibilitychange", restart);

  // Swipe on phones
  let startX = null;
  hero.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 45) { go(index + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
  }, { passive: true });

  restart();
})();
