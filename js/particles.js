/* ==========================================================================
   PARTICLES.JS — Renders the faint animated engineering grid + drifting
   particles on a full-viewport canvas behind all content. Kept lightweight:
   a fixed low particle count, no per-frame allocations, capped DPR.
   ========================================================================== */

(function () {
   console.log("NEW particles.js loaded");
  const canvas = document.getElementById("grid-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const GRID_SIZE = 64;
  const PARTICLE_COUNT = 36;
  let particles = [];
  let width, height, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06,
      alpha: Math.random() * 0.25 + 0.05,
    }));
  }

  function drawGrid() {
     ctx.strokeStyle = "#00ff00";
     ctx.lineWidth = 2;

  for (let x = 0; x <= width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  }

  function drawParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.fill();
    });
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    drawGrid();
    drawParticles();
    if (!reduceMotion) requestAnimationFrame(frame);
  }

  function start() {
    resize();
    initParticles();
    frame();
    // Static single paint for reduced-motion users.
    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawParticles();
    }
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 150);
  });

  start();
})();
