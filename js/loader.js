/* ============================================
   LOADER.JS
   Purpose: Loading screen animation and dismiss
   Dependencies: components.css
   Affects: #loader, #loader-bar-fill,
            #loader-percent, #loader-status
   ============================================ */

// ── ELEMENTS ─────────────────────────────────

const loader = document.getElementById("loader");
const barFill = document.getElementById("loader-bar-fill");
const percentText = document.getElementById("loader-percent");
const statusText = document.getElementById("loader-status");

// ── STATUS MESSAGES ──────────────────────────

/**
 * These messages cycle through as the bar fills.
 * Each has a threshold — when the bar reaches that
 * percentage this message is shown.
 */
const statusMessages = [
  { at: 0, text: "LOADING PARADOX..." },
  { at: 20, text: "MAPPING THE SPIRAL..." },
  { at: 40, text: "CALCULATING DEVIATION..." },
  { at: 60, text: "LOCATING THE CENTRE..." },
  { at: 75, text: "CENTRE NOT FOUND..." },
  { at: 88, text: "ABANDONING SEARCH..." },
  { at: 95, text: "APEX PROTOCOL READY" },
];

// ── LOADER LOGIC ─────────────────────────────

let current = 0;

/**
 * Increments the progress bar from 0 to 100.
 * Slows down near the end for dramatic effect.
 * Dismisses the loader when complete.
 */
function runLoader() {
  // How much to increment per tick
  // Slows down after 80% for tension
  let increment;

  if (current < 50) increment = 1.2;
  else if (current < 80) increment = 0.8;
  else if (current < 95) increment = 0.3;
  else increment = 0.15;

  current += increment;

  if (current >= 100) {
    current = 100;
    finish();
    return;
  }

  // Update bar width
  barFill.style.width = `${current}%`;

  // Update percent label
  percentText.textContent = `${Math.floor(current)}%`;

  // Update status message based on threshold
  statusMessages.forEach((msg) => {
    if (Math.floor(current) >= msg.at) {
      statusText.textContent = msg.text;
    }
  });

  // Schedule next tick
  // Interval slows slightly as it gets heavier
  const delay = current < 80 ? 30 : current < 95 ? 50 : 80;
  setTimeout(runLoader, delay);
}

/**
 * Called when progress hits 100.
 * Shows 100%, waits a moment, then hides the loader
 * and unlocks the page.
 */
function finish() {
  barFill.style.width = "100%";
  percentText.textContent = "100%";
  statusText.textContent = "ENTERING THE ABYSS...";

  // Short pause so user sees 100% before dismiss
  setTimeout(() => {
    loader.classList.add("hidden");

    // Remove from DOM entirely after transition ends
    // so it cannot block clicks underneath
    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
      },
      { once: true },
    );
  }, 600);
}

// ── START ────────────────────────────────────

/**
 * Wait for the page to be fully loaded before
 * starting the loader animation.
 * This way the bar reflects actual readiness.
 */
window.addEventListener("load", () => {
  // Small delay before bar starts moving
  // gives the flicker animation time to play
  setTimeout(runLoader, 400);
});
