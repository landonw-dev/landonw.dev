/* ==========================================================================
   SCROLL.JS — Splash intro transition + one-section-per-scroll navigation
   ("presentation slide" feel). Falls back gracefully to native scroll-snap
   on touch devices where wheel-hijacking feels wrong.
   ========================================================================== */

(function () {
  const splash = document.getElementById("splash");
  const container = document.querySelector(".snap-container");

  /* ---------- Splash intro ---------- */
  function runSplash() {
    if (!splash) return;

    const SPLASH_HOLD_MS = 1000;
    const SPLASH_TRANSITION_MS = 1000;

    setTimeout(() => {
      splash.classList.add("splash-exit");
      setTimeout(() => {
        splash.style.display = "none";
      }, SPLASH_TRANSITION_MS);
    }, SPLASH_HOLD_MS + 300); // + fade-in time
  }

  /* ---------- Section snapping ---------- */
  function initSnapScroll() {
    if (!container) return;

    const sections = Array.from(container.querySelectorAll(".section"));
    let currentIndex = 0;
    let isAnimating = false;
    const COOLDOWN_MS = 850;

    function goToSection(index) {
      const clamped = Math.max(0, Math.min(sections.length - 1, index));
      if (clamped === currentIndex && isAnimating === false && clamped !== 0) {
        // still allow re-trigger from index 0
      }
      isAnimating = true;
      currentIndex = clamped;
      sections[currentIndex].scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isAnimating = false;
      }, COOLDOWN_MS);
      updateActiveNavLink(sections[currentIndex].id);
    }

    function updateActiveNavLink(id) {
      document.querySelectorAll(".navbar__link").forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    }

    // Sync currentIndex if the user free-scrolls (e.g. via nav click or touch)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = sections.indexOf(entry.target);
            if (idx !== -1) {
              currentIndex = idx;
              updateActiveNavLink(entry.target.id);
            }
          }
        });
      },
      { root: container, threshold: [0.6] }
    );
    sections.forEach((s) => observer.observe(s));

    // Only hijack the wheel on devices with a real mouse wheel (desktop).
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (isFinePointer) {
      container.addEventListener(
        "wheel",
        (e) => {
          if (isAnimating) {
            e.preventDefault();
            return;
          }
          e.preventDefault();
          if (e.deltaY > 8) {
            goToSection(currentIndex + 1);
          } else if (e.deltaY < -8) {
            goToSection(currentIndex - 1);
          }
        },
        { passive: false }
      );
    }

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      if (isAnimating) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToSection(currentIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSection(currentIndex - 1);
      }
    });

    // Scroll indicator + nav links jump straight to their target section
    document.querySelectorAll('[data-scroll-to]').forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = el.getAttribute("data-scroll-to");
        const targetIndex = sections.findIndex((s) => s.id === targetId);
        if (targetIndex !== -1) goToSection(targetIndex);
      });
    });

    updateActiveNavLink(sections[0].id);
  }

  document.addEventListener("DOMContentLoaded", () => {
    runSplash();
    initSnapScroll();
  });
})();
