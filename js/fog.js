/* ============================================
   FOG.JS
   Purpose: Drifting fog/mist layers that float
            across the page as you scroll
   Dependencies: None
   Affects: Creates .fog-layer elements on body
   Note: Pure CSS animation driven — lightweight
   ============================================ */

// ── CONFIG ───────────────────────────────────

const FOG_LAYERS = 4;

// ── CREATE FOG CONTAINER ─────────────────────

const fogContainer = document.createElement("div");
fogContainer.id = "fog-container";
document.body.appendChild(fogContainer);

// ── CREATE FOG LAYERS ────────────────────────

for (let i = 0; i < FOG_LAYERS; i++) {
  const layer = document.createElement("div");
  layer.classList.add("fog-layer");

  // Each layer has different size speed and position
  const size = 400 + i * 200;
  const duration = 20 + i * 8;
  const top = Math.random() * 80;
  const delay = i * -5;
  const opacity = 0.03 + i * 0.01;
  const direction = i % 2 === 0 ? 1 : -1;

  layer.style.width = size + "px";
  layer.style.height = size + "px";
  layer.style.top = top + "%";
  layer.style.animationDuration = duration + "s";
  layer.style.animationDelay = delay + "s";
  layer.style.opacity = opacity;
  layer.style.setProperty("--fog-direction", direction);

  fogContainer.appendChild(layer);
}

// ── SCROLL BASED DRIFT ───────────────────────

/**
 * Fog layers shift vertically as user scrolls
 * creating a parallax-like depth effect.
 */
window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.scrollY;
    const layers = document.querySelectorAll(".fog-layer");

    layers.forEach((layer, i) => {
      const speed = 0.02 + i * 0.01;
      const yShift = scrolled * speed;
      layer.style.transform = `translateY(${yShift}px)`;
    });
  },
  { passive: true },
);
