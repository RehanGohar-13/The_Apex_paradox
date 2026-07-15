/* ============================================
   CURSOR.JS
   Purpose: Custom cursor dot with trail effect
            and expanded state on hoverable elements
   Dependencies: components.css
   Affects: #custom-cursor, .cursor-trail
   Note: Only activates on mouse devices
         Touch devices keep default cursor
   ============================================ */

// ── DEVICE CHECK ─────────────────────────────

/**
 * Only run on devices with a fine pointer (mouse).
 * On touch devices we do nothing and the default
 * cursor stays — components.css hides our custom
 * cursor on those devices anyway.
 */
const isMouse = window.matchMedia("(pointer: fine)").matches;
if (!isMouse) {
  // Stop the entire script on touch devices
  throw new Error("CURSOR: Touch device detected — skipping cursor init.");
}

// ── ELEMENTS ─────────────────────────────────

const cursor = document.getElementById("custom-cursor");

// ── POSITION TRACKING ────────────────────────

/**
 * Target position — where the mouse actually is.
 * Current position — where the cursor dot is now.
 * We lerp between them for a smooth lag effect.
 */
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

/**
 * Track the real mouse position at all times.
 */
window.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;

  // Spawn a trail dot at the real mouse position
  spawnTrail(e.clientX, e.clientY);
});

// ── SMOOTH CURSOR MOVEMENT ───────────────────

/**
 * Lerp factor — how quickly the cursor catches up.
 * Lower = more lag = dreamier feel.
 * Higher = snappier = more precise feel.
 * 0.12 feels right for this site's tone.
 */
const LERP = 0.45;

/**
 * Animation loop — runs every frame.
 * Moves cursor dot smoothly toward the mouse position.
 */
function animateCursor() {
  // Linear interpolation toward target
  currentX += (targetX - currentX) * LERP;
  currentY += (targetY - currentY) * LERP;

  cursor.style.left = `${currentX}px`;
  cursor.style.top = `${currentY}px`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

// ── CURSOR STATES ────────────────────────────

/**
 * Elements that should trigger the expanded cursor state.
 * Add any selector here to make the cursor expand on hover.
 */
const hoverTargets = "a, button, .comparison-card, .question-item, .nav-logo";

/**
 * Expand cursor when hovering interactive elements.
 */
document.addEventListener("mouseover", (e) => {
  if (e.target.closest(hoverTargets)) {
    cursor.classList.add("expanded");
  }
});

/**
 * Shrink cursor back when leaving interactive elements.
 */
document.addEventListener("mouseout", (e) => {
  if (e.target.closest(hoverTargets)) {
    cursor.classList.remove("expanded");
  }
});

/**
 * Hide cursor when mouse leaves the window entirely.
 */
document.addEventListener("mouseleave", () => {
  cursor.style.opacity = "0";
});

document.addEventListener("mouseenter", () => {
  cursor.style.opacity = "1";
});

// ── CLICK PULSE ──────────────────────────────

/**
 * On click, briefly scale the cursor up then back
 * to give tactile feedback on interactions.
 */
document.addEventListener("mousedown", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(0.7)";
});

document.addEventListener("mouseup", () => {
  cursor.style.transform = "translate(-50%, -50%) scale(1)";
});

// ── TRAIL DOTS ───────────────────────────────

/**
 * Maximum number of trail dots alive at once.
 * Higher = longer trail but more DOM elements.
 */
const MAX_TRAIL = 12;
let trailCount = 0;

/**
 * Spawns a single trail dot at the given position.
 * The dot fades and shrinks via the trailFade
 * animation defined in animations.css then removes itself.
 */
function spawnTrail(x, y) {
  // Throttle — do not spawn if we already have max trails
  if (trailCount >= MAX_TRAIL) return;

  const dot = document.createElement("div");
  dot.classList.add("cursor-trail");

  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;

  // Randomise size slightly so trail feels organic
  const size = 2 + Math.random() * 3;
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;

  document.body.appendChild(dot);
  trailCount++;

  // Remove after animation completes (0.6s in animations.css)
  setTimeout(() => {
    dot.remove();
    trailCount--;
  }, 600);
}
