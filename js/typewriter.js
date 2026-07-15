/* ============================================
   TYPEWRITER.JS
   Purpose: Types out the hero tagline letter
            by letter with a blinking cursor
   Dependencies: animations.css (blink keyframe)
   Affects: #hero-tagline
   ============================================ */

// ── CONFIG ───────────────────────────────────

/**
 * The full text to type out.
 * Wrapped in quotes to match the original design.
 */
const TAGLINE_TEXT = "\u201CThe spiral never returns to its centre.\u201D";

/**
 * Speed in milliseconds between each character.
 * Lower = faster typing.
 * 70ms feels like deliberate transmission.
 */
const TYPE_SPEED = 70;

/**
 * Delay before typing starts in milliseconds.
 * Waits for hero fade-in animations to finish first.
 * The hero tagline fadeInUp ends at 1.1s + 1s = 2.1s
 * so we start at 2.2s to be safe.
 */
const START_DELAY = 2200;

/**
 * How long the cursor blinks after typing finishes
 * before it disappears. In milliseconds.
 */
const CURSOR_LINGER = 2500;

// ── ELEMENTS ─────────────────────────────────

const tagline = document.getElementById("hero-tagline");

// ── SAFETY CHECK ─────────────────────────────

if (!tagline) {
  console.warn("TYPEWRITER: #hero-tagline not found — skipping.");
} else {
  initTypewriter();
}

function initTypewriter() {
  // Remove the CSS fadeInUp animation since we
  // handle visibility ourselves
  tagline.style.animation = "none";
  tagline.style.opacity = "1";

  // Make sure content is empty to start
  tagline.textContent = "";

  // Create the blinking cursor element
  const cursorEl = document.createElement("span");
  cursorEl.classList.add("typewriter-cursor");
  tagline.appendChild(cursorEl);

  // ── TYPING LOGIC ─────────────────────────

  let charIndex = 0;

  function typeNext() {
    if (charIndex < TAGLINE_TEXT.length) {
      // Insert the next character before the cursor
      const charNode = document.createTextNode(TAGLINE_TEXT.charAt(charIndex));
      tagline.insertBefore(charNode, cursorEl);

      charIndex++;

      // Randomise speed slightly so it feels human
      // Base speed ± 30ms variance
      const variance = Math.random() * 60 - 30;
      const nextDelay = Math.max(30, TYPE_SPEED + variance);

      setTimeout(typeNext, nextDelay);
    } else {
      // Typing complete — let cursor blink then remove it
      setTimeout(() => {
        cursorEl.style.animation = "none";
        cursorEl.style.opacity = "0";
        cursorEl.style.transition = "opacity 0.5s ease";

        // Remove cursor element from DOM after fade
        setTimeout(() => {
          cursorEl.remove();
        }, 500);
      }, CURSOR_LINGER);
    }
  }

  // ── START ────────────────────────────────

  /**
   * Wait for the start delay then begin typing.
   * If the loader exists wait for it to finish first.
   */
  const loader = document.getElementById("loader");

  if (loader) {
    // Watch for the loader to be removed or hidden
    const loaderObserver = new MutationObserver(() => {
      if (loader.classList.contains("hidden") || !document.contains(loader)) {
        loaderObserver.disconnect();
        setTimeout(typeNext, 800);
      }
    });

    loaderObserver.observe(loader, {
      attributes: true,
      childList: false,
      subtree: false,
      attributeFilter: ["class"],
    });

    // Fallback — if loader is somehow already hidden
    if (loader.classList.contains("hidden")) {
      loaderObserver.disconnect();
      setTimeout(typeNext, 800);
    }
  } else {
    // No loader — just use the delay
    setTimeout(typeNext, START_DELAY);
  }
}
