/* ============================================================
   TIAGO SANTOS — retro dark / CRT portfolio
   vanilla JS: PT/EN toggle, typewriter, scroll reveal, canvas.
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- language toggle ---------------- */
  var currentLang = "en";

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-en][data-pt]");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var hasChildElements = node.querySelector("*") !== null;
      if (hasChildElements) continue;
      if (lang === "pt") {
        node.textContent = node.getAttribute("data-pt");
      } else {
        node.textContent = node.getAttribute("data-en");
      }
    }
    if (typeof typeTagline === "function") {
      typeTagline(lang);
    }
  }

  var langBtns = document.querySelectorAll(".lang-btn");
  for (var l = 0; l < langBtns.length; l++) {
    langBtns[l].addEventListener("click", function () {
      var lang = this.getAttribute("data-lang");
      if (lang === currentLang) return;
      currentLang = lang;
      for (var j = 0; j < langBtns.length; j++) {
        var active = langBtns[j].getAttribute("data-lang") === lang;
        langBtns[j].classList.toggle("is-active", active);
        langBtns[j].setAttribute("aria-pressed", active ? "true" : "false");
      }
      applyLang(lang);
    });
  }

  /* ---------------- PDF placeholder alerts ---------------- */
  var alertChips = document.querySelectorAll("[data-alert-en]");
  for (var a = 0; a < alertChips.length; a++) {
    alertChips[a].addEventListener("click", function (e) {
      e.preventDefault();
      var msg = this.getAttribute(currentLang === "pt" ? "data-alert-pt" : "data-alert-en");
      alert(msg);
    });
  }

  /* ---------------- typewriter tagline ---------------- */
  var tagline = document.getElementById("tagline");
  var typing = false;
  var timer = null;

  function typeTagline(lang) {
    if (!tagline) return;
    var text = tagline.getAttribute(lang === "pt" ? "data-pt" : "data-en");
    if (timer) { clearInterval(timer); timer = null; }
    if (reduced) {
      tagline.textContent = text;
      return;
    }
    typing = true;
    tagline.textContent = "";
    var i = 0;
    timer = setInterval(function () {
      tagline.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(timer);
        timer = null;
        typing = false;
      }
    }, 28);
  }

  /* ---------------- scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      for (var k = 0; k < entries.length; k++) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add("in-view");
          io.unobserve(entries[k].target);
        }
      }
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    for (var r = 0; r < revealEls.length; r++) {
      io.observe(revealEls[r]);
    }
  } else {
    for (var r2 = 0; r2 < revealEls.length; r2++) {
      revealEls[r2].classList.add("in-view");
    }
  }

  /* ---------------- hero neural field ---------------- */
  var canvas = document.getElementById("field");
  var ctx = canvas ? canvas.getContext("2d") : null;

  if (ctx) {
    var W = 0, H = 0, nodes = [], DPR = Math.min(window.devicePixelRatio || 1, 2);
    var NODE_COUNT = 42;
    var LINK_DIST = 150;
    var raf = null;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function seed() {
      nodes = [];
      for (var i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            var alpha = (1 - d / LINK_DIST) * 0.22;
            ctx.strokeStyle = "rgba(46, 232, 110, " + alpha.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = "rgba(46, 232, 110, 0.8)";
        ctx.beginPath();
        ctx.arc(a.x, a.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      resize();
      seed();
      if (reduced) {
        frame();
        cancelAnimationFrame(raf);
      } else {
        frame();
      }
    }

    window.addEventListener("resize", function () {
      resize();
      if (reduced) {
        cancelAnimationFrame(raf);
        frame();
        cancelAnimationFrame(raf);
      }
    });

    start();
  }

  /* ---------------- init ---------------- */
  applyLang(currentLang);
})();