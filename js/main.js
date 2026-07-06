/* ==========================================================================
   MAIN.JS — Entry point. Wires up the navbar, mobile menu, hero typing
   sequence, and generic scroll-reveal behavior. Keeps DOM queries scoped
   and defers to typing.js / scroll.js / particles.js for their concerns.
   ========================================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    initNavbarShrink();
    initMobileMenu();
    initHeroTyping();
    initRevealOnScroll();
  });

  /* ---------- Navbar shrink on scroll ---------- */
  function initNavbarShrink() {
    const navbar = document.querySelector(".navbar");
    const scrollHost = document.querySelector(".snap-container") || window;
    if (!navbar) return;

    const getScrollTop = () =>
      scrollHost === window ? window.scrollY : scrollHost.scrollTop;

    function onScroll() {
      navbar.classList.toggle("is-scrolled", getScrollTop() > 20);
    }

    scrollHost.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile hamburger menu ---------- */
  function initMobileMenu() {
    const toggle = document.querySelector(".navbar__toggle");
    const links = document.querySelector(".navbar__links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });

    links.querySelectorAll(".navbar__link").forEach((link) => {
      link.addEventListener("click", () => links.classList.remove("is-open"));
    });
  }

  /* ---------- Hero typing sequence ---------- */
  function initHeroTyping() {
    const el = document.querySelector("[data-typing-target]");
    if (!el || typeof window.typeText !== "function") return;

    const text = el.getAttribute("data-typing-target");
    // Starts after the heading + typing-line fade-in animations resolve
    // (see the animation-delay values on .hero__title / .typing-line in home.css).
    window.typeText(el, text, { delay: 1450, speed: 42 });
  }

  /* ---------- Generic reveal-on-scroll ---------- */
  function initRevealOnScroll() {
    const targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (!targets.length) return;

    const scrollHost = document.querySelector(".snap-container") || null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { root: scrollHost, threshold: 0.2 }
    );

    targets.forEach((t) => observer.observe(t));
  }
})();
