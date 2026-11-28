/* Modern Eyes Colorado — nav + hero photo slideshow */
(function () {
  document.documentElement.classList.add("js");
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
  // The closed menu is visibility:hidden in CSS, so its links can't take focus.
  // Tab order is: menu button, then the links (the button is before the nav in the HTML).

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

  // Offers: after the expiry date (end of that day, visitor's local time) hide the offer
  // cards and show the "offer has ended" message on the offer page.
  (function () {
    const cards = document.querySelectorAll("[data-offer-expires]");
    let ended = false;
    cards.forEach(function (card) {
      const p = card.dataset.offerExpires.split("-").map(Number);
      const endOfDay = new Date(p[0], p[1] - 1, p[2], 23, 59, 59, 999);
      if (new Date() > endOfDay) {
        ended = true;
        if (!card.closest("[data-offer-page]")) card.hidden = true;
      }
    });
    const page = document.querySelector("[data-offer-page]");
    if (page && ended) page.classList.add("offer-ended");
    // Testing: add ?offerEnded=1 to the offer page address to preview the ended message.
    if (page && /[?&]offerEnded=1/.test(location.search)) page.classList.add("offer-ended");
  })();

  // Open a service when linked directly (e.g. services.html#contacts)
  function openFromHash() {
    if (!location.hash) return;
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.tagName === "DETAILS") target.open = true;
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  // Booking step: pick an office to see what can be booked online there
  let pickOffice = null;
  const choices = Array.from(document.querySelectorAll(".loc-choice"));
  const panels = Array.from(document.querySelectorAll(".booking-panel"));
  const prompt = document.getElementById("loc-prompt");
  if (choices.length && panels.length) {
    function selectLoc(slug, focus) {
      let found = false;
      panels.forEach(function (p) {
        const on = p.dataset.loc === slug;
        p.hidden = !on;
        if (on) found = true;
      });
      choices.forEach(function (c) {
        c.setAttribute("aria-pressed", c.dataset.loc === slug ? "true" : "false");
      });
      if (prompt) prompt.hidden = found;
      if (found) document.dispatchEvent(new CustomEvent("me:office", { detail: slug }));
      if (found && focus) {
        const panel = document.getElementById("book-" + slug);
        panel.focus({ preventScroll: true });
        const rect = panel.getBoundingClientRect();
        if (rect.top > window.innerHeight * 0.6) panel.scrollIntoView({ block: "start" });
      }
      return found;
    }
    choices.forEach(function (c) {
      c.setAttribute("role", "button");
      c.addEventListener("click", function (e) {
        e.preventDefault();
        selectLoc(c.dataset.loc, true);
        if (history.replaceState) history.replaceState(null, "", "#book-" + c.dataset.loc);
      });
    });
    function fromHash(scroll) {
      const m = location.hash.match(/^#book-(centennial|castle-rock|aurora)$/);
      if (m) {
        selectLoc(m[1], false);
        if (scroll) {
          const sec = document.getElementById("book-online");
          requestAnimationFrame(function () { sec.scrollIntoView(); });
        }
      } else if (!scroll) {
        selectLoc(null, false);
      }
    }
    pickOffice = function (slug) {
      selectLoc(slug, false);
      if (history.replaceState) history.replaceState(null, "", "#book-" + slug);
    };
    fromHash(false);
    if (/^#book-(centennial|castle-rock|aurora)$/.test(location.hash)) fromHash(true);
    window.addEventListener("hashchange", function () { fromHash(true); });
  }

  // "Which exam do I need?" guide on the booking step
  const guide = document.querySelector("[data-guide]");
  if (guide) {
    const SCHED = "https://scheduler.eyefinity.com/index.html?domainName=moderneyesco.com";
    const OFFICES = {
      "centennial": { name: "Centennial", label: "Modern Eyes - Centennial", tel: "+13037732020", phone: "(303) 773-2020", medical: true, doctors: "Dr. Benjamin Sturdy or Dr. Tara Keesey" },
      "castle-rock": { name: "Castle Rock", label: "Modern Eyes - Castle Rock", tel: "+13036880707", phone: "(303) 688-0707", medical: true, doctors: "Dr. Benjamin Sturdy or Dr. Tara Keesey" },
      "aurora": { name: "Aurora", label: "Modern Eyes - Aurora", tel: "+13036901696", phone: "(303) 690-1696", medical: false, doctors: "Dr. Benjamin Sturdy or Dr. Kevin Anderson" }
    };
    const ORDER = ["centennial", "castle-rock", "aurora"];
    const EXT = '<svg class="ext-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const steps = {};
    guide.querySelectorAll(".guide-step").forEach(function (s) { steps[s.dataset.step] = s; });
    const result = guide.querySelector("[data-result]");
    const state = { reason: null, patient: null, office: null };
    let trail = [];

    function currentOffice() {
      const pressed = document.querySelector('.loc-choice[aria-pressed="true"]');
      return pressed ? pressed.dataset.loc : null;
    }
    function needsPatient(r) { return r === "routine" || r === "glasses"; }
    function plan() {
      // Which questions this answer path asks, in order
      if (state.reason === "urgent") return ["reason"];
      const q = ["reason"];
      if (needsPatient(state.reason)) q.push("patient");
      q.push("office");
      return q;
    }
    function show(name, focus) {
      const order = plan();
      Object.keys(steps).forEach(function (k) { steps[k].hidden = k !== name; });
      result.hidden = name !== "result";
      if (name !== "result") {
        const prog = steps[name].querySelector("[data-progress]");
        const total = order.length;
        const n = order.indexOf(name) + 1;
        if (prog) prog.textContent = name === "reason" ? "Quick question" : "Question " + n + " of " + total;
        if (focus) steps[name].querySelector(".guide-q").focus({ preventScroll: true });
      }
      if (focus) {
        const top = guide.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.5) guide.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
    function nextAfter(name) {
      const order = plan();
      for (let i = order.indexOf(name) + 1; i < order.length; i++) {
        if (order[i] === "office" && state.office) continue; // already picked an office
        return order[i];
      }
      return "result";
    }
    function go(from, focus) {
      const to = nextAfter(from);
      trail.push(from);
      if (to === "result") renderResult(focus);
      else show(to, focus);
    }
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

    function schedBtn(text) {
      return '<a class="btn btn-primary guide-go" href="' + SCHED + '" target="_blank" rel="noopener">' + esc(text || "Continue to online scheduler") + " " + EXT + '<span class="sr-only"> (opens in a new tab)</span></a>';
    }
    function callBtn(o, primary) {
      return '<a class="btn ' + (primary ? "btn-coral" : "btn-secondary") + ' guide-call" href="tel:' + o.tel + '">Call ' + esc(o.name) + ' <span class="nowrap">' + o.phone + "</span></a>";
    }
    function officeLine(o) {
      return '<p class="result-office">Office: <strong>' + esc(o.name) + '</strong> <button type="button" class="guide-link" data-change-office>Change office</button></p>';
    }
    function bookSteps(o, visit) {
      return '<ol class="result-steps">' +
        "<li>Tap <strong>Continue to online scheduler</strong> below. It opens in a new tab.</li>" +
        "<li>Choose <strong>" + esc(o.label) + "</strong>.</li>" +
        '<li>Choose <span class="visit-label">' + esc(visit) + "</span>.</li>" +
        "<li>Pick your <strong>insurance carrier</strong> (required). Keep your insurance card handy.</li>" +
        "<li>Pick " + esc(o.doctors) + ", or “No Preference,” then choose a time.</li>" +
        "</ol>";
    }
    function card(kind, kicker, title, body, actions) {
      return '<div class="result-card result-' + kind + '">' +
        '<p class="result-kicker">' + kicker + "</p>" +
        '<h4 class="result-title" tabindex="-1">' + title + "</h4>" + body +
        '<div class="result-actions">' + actions + "</div>" +
        '<p class="new-tab-hint result-hint">The scheduler opens in a new tab, so this page stays open.</p>' +
        '<div class="result-foot"><button type="button" class="guide-back" data-back>← Back</button><button type="button" class="guide-link" data-restart>Start over</button></div>' +
        "</div>";
    }

    function renderResult(focus) {
      const r = state.reason;
      const o = OFFICES[state.office];
      let html = "";
      if (r === "urgent") {
        html = '<div class="result-card result-urgent">' +
          '<p class="result-kicker">Urgent eye problem</p>' +
          '<h4 class="result-title" tabindex="-1">Call an office right away</h4>' +
          "<p>Please don’t use the online scheduler for this. We see patients for emergency eye care such as a red eye or something stuck in the eye, so call your nearest office right away.</p>" +
          '<div class="result-actions result-actions-3">' + ORDER.map(function (k) { return callBtn(OFFICES[k], true); }).join("") + "</div>" +
          '<p class="result-er"><strong>If we’re closed, or it’s a serious injury, a chemical splash or sudden vision loss,</strong> go to the nearest emergency room or call 911.</p>' +
          '<div class="result-foot"><button type="button" class="guide-back" data-back>← Back</button><button type="button" class="guide-link" data-restart>Start over</button></div>' +
          "</div>";
      } else if (r === "routine" || r === "glasses") {
        const visit = state.patient === "new" ? "Eye Exam - New Patient" : "Eye Exam - Existing Patient";
        let body = officeLine(o) + bookSteps(o, visit);
        if (r === "glasses") body += '<p class="result-note">Your eye exam includes vision testing for an updated glasses prescription, and our staff can help you pick frames afterward. Already have a current prescription and just need new frames or lenses? Call ' + esc(o.name) + " at " + o.phone + ".</p>";
        if (state.patient === "new") body += '<p class="result-note">First visit? Please download and fill out the <a href="#new-patients">new patient form</a> and bring it with you.</p>';
        html = card("book", "Book online", "Choose <span class=\"visit-label\">" + visit + "</span>", body, schedBtn() + callBtn(o, false));
      } else if (r === "problem") {
        if (o.medical) {
          const body = officeLine(o) + bookSteps(o, "Medical Visit (Non-Emergency)") +
            '<p class="result-note">If your eye is very painful, was injured, or your vision changed suddenly, don’t wait for an appointment. Call ' + esc(o.name) + " at " + o.phone + " right away.</p>";
          html = card("book", "Book online", "Choose <span class=\"visit-label\">Medical Visit (Non-Emergency)</span>", body, schedBtn() + callBtn(o, false));
        } else {
          const body = officeLine(o) +
            "<p>Medical visits aren’t offered in the online scheduler for the Aurora office. Call Aurora at " + o.phone + " to ask about a visit.</p>" +
            '<p class="result-note">Prefer to book online? <strong>Medical Visit (Non-Emergency)</strong> can be booked online at <strong>Centennial</strong> or <strong>Castle Rock</strong>. <button type="button" class="guide-link" data-change-office>Choose another office</button></p>';
          html = card("call", "Call to book", "Call the Aurora office", body, callBtn(o, true) + schedBtn("Book online at Centennial or Castle Rock"));
        }
      } else {
        const info = {
          contacts: ["Call to book your contact lens exam", "The online scheduler has no visit type just for contact lens exams and fittings. Call " + esc(o.name) + " to book."],
          child: ["Call to book your child’s eye exam", "We take pride in caring for our younger patients in an environment that is lighthearted and fun. The online scheduler has no visit type just for children, so call " + esc(o.name) + " to book."],
          lasik: ["Call about LASIK", "We check whether you’re a good candidate, refer you to the LASIK surgery center we work with, and handle your care before and after surgery. Call " + esc(o.name) + " to set up a visit, or <a href=\"services.html#lasik\">read more about LASIK</a>."]
        }[r];
        const body = officeLine(o) + "<p>" + info[1] + "</p>" + '<p class="result-note">Have your insurance card handy when you call.</p>';
        html = card("call", "Call to book", info[0], body, callBtn(o, true));
      }
      result.innerHTML = html;
      show("result", false);
      if (focus) {
        const t = result.querySelector(".result-title");
        if (t) t.focus({ preventScroll: true });
        const top = guide.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.5) guide.scrollIntoView({ block: "start" });
      }
    }

    function restart(focus) {
      state.reason = null; state.patient = null; state.office = currentOffice();
      trail = [];
      result.innerHTML = "";
      show("reason", focus);
    }

    function back() {
      const prev = trail.pop();
      if (!prev) return restart(true);
      show(prev, true);
    }

    guide.addEventListener("click", function (e) {
      const opt = e.target.closest(".guide-opt");
      if (opt) {
        if (opt.dataset.reason) {
          state.reason = opt.dataset.reason; state.patient = null;
          if (!state.office) state.office = currentOffice();
          go("reason", true);
        } else if (opt.dataset.patient) {
          state.patient = opt.dataset.patient;
          go("patient", true);
        } else if (opt.dataset.office) {
          state.office = opt.dataset.office;
          if (pickOffice) pickOffice(state.office);
          go("office", true);
        }
        return;
      }
      if (e.target.closest("[data-back]")) { back(); return; }
      if (e.target.closest("[data-restart]")) { restart(true); return; }
      if (e.target.closest("[data-change-office]")) {
        trail = plan().filter(function (h) { return h !== "office"; });
        show("office", true);
      }
    });

    // Keep the guide in step with the office picker below it
    document.addEventListener("me:office", function (e) {
      const slug = e.detail;
      if (!slug || slug === state.office) return;
      state.office = slug;
      if (!result.hidden) renderResult(false);
    });

    restart(false);
  }

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  if (!slides.length) return;

  const prev = hero.querySelector(".hero-prev");
  const next = hero.querySelector(".hero-next");
  const dotsWrap = hero.querySelector(".hero-dots");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pauseBtn = hero.querySelector(".hero-pause");
  let index = 0;
  let timer = null;
  let paused = false;          // temporary: mouse or keyboard focus is inside the hero
  let userPaused = reduceMotion; // the Pause/Play button; starts paused when the visitor prefers reduced motion

  // Photos after the first are loaded only when they are about to be shown.
  function load(slide) {
    if (!slide || !slide.dataset.src) return;
    if (slide.dataset.srcset) slide.srcset = slide.dataset.srcset;
    slide.src = slide.dataset.src;
    slide.removeAttribute("data-src");
    slide.removeAttribute("data-srcset");
  }
  function preloadNext() { load(slides[(index + 1) % slides.length]); }

  function renderPause() {
    if (!pauseBtn) return;
    pauseBtn.classList.toggle("is-paused", userPaused);
    pauseBtn.setAttribute("aria-pressed", userPaused ? "true" : "false");
    pauseBtn.setAttribute("aria-label", userPaused ? "Play photo slideshow" : "Pause photo slideshow");
    pauseBtn.querySelector(".hero-pause-text").textContent = userPaused ? "Play" : "Pause";
  }

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
    load(slides[index]);
    slides.forEach(function (slide, n) {
      slide.classList.toggle("is-active", n === index);
    });
    preloadNext();
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
    if (userPaused || paused || document.hidden) return;
    timer = setInterval(function () {
      go(index + 1);
    }, 5000);
  }

  if (pauseBtn) pauseBtn.addEventListener("click", function () {
    userPaused = !userPaused;
    renderPause();
    restart();
  });

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

  renderPause();
  restart();
  // Warm up photo 2 once the page has finished loading, so the first change is smooth.
  if (document.readyState === "complete") preloadNext();
  else window.addEventListener("load", preloadNext);
})();
