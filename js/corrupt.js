/* ============================================
   CORRUPT.JS
   Purpose: Random letters in text briefly glitch
            into corrupted characters
   Dependencies: None
   Affects: .section p, .quote-block p
   
   Two modes:
   1. SCROLL MODE — corrupts while scrolling
   2. IDLE MODE — random corruption while reading
   
   Both are moderate and readable
   ============================================ */

// ── CONFIG ───────────────────────────────────

const CORRUPT_CHARS = "▓▒░█▄▀■□▪▫◆◇○●◎◉⬡⬢∆∇⊗⊕";

/**
 * Characters corrupted per burst.
 */
const CORRUPT_COUNT = 2;

/**
 * How long corruption shows in ms.
 */
const CORRUPT_DURATION = 120;

// ── SCROLL MODE CONFIG ───────────────────────

/**
 * Cooldown between scroll bursts in ms.
 */
const SCROLL_COOLDOWN = 1500;

/**
 * Minimum scroll speed to trigger.
 */
const SCROLL_THRESHOLD = 2;

// ── IDLE MODE CONFIG ─────────────────────────

/**
 * How often idle corruption can happen in ms.
 * Random corruption every 3-6 seconds while idle.
 */
const IDLE_MIN_INTERVAL = 3000;
const IDLE_MAX_INTERVAL = 6000;

// ── GATHER TARGETS ───────────────────────────

const corruptTargets = document.querySelectorAll(
  ".section p, .quote-block p, .timeline-text, .question-text",
);

if (corruptTargets.length === 0) {
  console.warn("CORRUPT: No targets found.");
}

// ── CORE CORRUPT FUNCTION ────────────────────

/**
 * Corrupts a single element briefly then restores it.
 * This is the only function that touches the DOM.
 */
function corruptElement(target) {
  if (!target) return;

  // Only corrupt if in viewport
  const rect = target.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (!inView) return;

  const originalHTML = target.innerHTML;
  const text = target.textContent;
  if (text.length < 10) return;

  let chars = text.split("");

  for (let i = 0; i < CORRUPT_COUNT; i++) {
    let pos;
    let attempts = 0;

    do {
      pos = Math.floor(Math.random() * chars.length);
      attempts++;
    } while (chars[pos] === " " && attempts < 20);

    if (attempts < 20) {
      chars[pos] =
        CORRUPT_CHARS[Math.floor(Math.random() * CORRUPT_CHARS.length)];
    }
  }

  target.textContent = chars.join("");

  setTimeout(() => {
    target.innerHTML = originalHTML;
  }, CORRUPT_DURATION);
}

/**
 * Pick a random visible target and corrupt it.
 */
function corruptRandom() {
  // Collect all currently visible targets
  const visible = [];

  corruptTargets.forEach((t) => {
    const rect = t.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      visible.push(t);
    }
  });

  if (visible.length === 0) return;

  const target = visible[Math.floor(Math.random() * visible.length)];
  corruptElement(target);
}

// ── SCROLL MODE ──────────────────────────────

let lastScrollY = window.scrollY;
let scrollSpeed = 0;
let lastScrollBurst = 0;

window.addEventListener(
  "scroll",
  () => {
    scrollSpeed = Math.abs(window.scrollY - lastScrollY);
    lastScrollY = window.scrollY;

    const now = Date.now();

    if (
      scrollSpeed >= SCROLL_THRESHOLD &&
      now - lastScrollBurst >= SCROLL_COOLDOWN
    ) {
      lastScrollBurst = now;
      corruptRandom();
    }
  },
  { passive: true },
);

// ── IDLE MODE ────────────────────────────────

/**
 * Schedules random corruptions at irregular intervals.
 * This runs regardless of scrolling so text glitches
 * even while the user is sitting still and reading.
 */
function scheduleIdleCorruption() {
  const delay =
    IDLE_MIN_INTERVAL + Math.random() * (IDLE_MAX_INTERVAL - IDLE_MIN_INTERVAL);

  setTimeout(() => {
    corruptRandom();
    scheduleIdleCorruption();
  }, delay);
}

// Start idle corruption after a short initial delay
setTimeout(scheduleIdleCorruption, 2000);
