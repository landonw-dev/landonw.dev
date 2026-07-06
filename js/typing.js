/* ==========================================================================
   TYPING.JS — Small reusable typewriter effect.
   Usage: window.typeText(el, "text to type", { delay, speed, onDone })
   ========================================================================== */

(function () {
  function typeText(el, text, options = {}) {
    const { delay = 0, speed = 45, onDone } = options;
    if (!el) return;

    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";

    const textNode = document.createElement("span");
    el.appendChild(textNode);
    el.appendChild(cursor);
    el.style.opacity = "1";

    let i = 0;

    function step() {
      if (i <= text.length) {
        textNode.textContent = text.slice(0, i);
        i++;
        // Slight natural variance in typing speed
        const jitter = Math.random() * 40 - 10;
        setTimeout(step, speed + jitter);
      } else if (typeof onDone === "function") {
        onDone();
      }
    }

    setTimeout(step, delay);
  }

  window.typeText = typeText;
})();
