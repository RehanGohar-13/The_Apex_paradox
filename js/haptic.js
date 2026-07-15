/* ============================================
   HAPTIC.JS
   Purpose: Vibrate on mobile when tapping
            key phrases and interactive elements
   Dependencies: None
   Note: Only works on mobile devices that
         support the Vibration API
         Does nothing on desktop
   ============================================ */

// ── CHECK SUPPORT ────────────────────────────

if (!navigator.vibrate) {
  // Device does not support vibration — do nothing
} else {
  initHaptic();
}

function initHaptic() {
  // ── HIGHLIGHT TEXT TAPS ──────────────────

  /**
   * When a user taps any highlighted or strong text
   * give a short pulse. Makes the text feel alive.
   */
  const hapticTargets = document.querySelectorAll(
    ".highlight-text, .quote-block p, .section-title, .hero-title",
  );

  hapticTargets.forEach((el) => {
    el.addEventListener(
      "touchstart",
      () => {
        navigator.vibrate(30);
      },
      { passive: true },
    );
  });

  // ── SCALE POINT TAPS ─────────────────────

  /**
   * Stronger vibration on scale points since
   * they represent evolution stages.
   * Chaos points vibrate harder.
   */
  const scalePoints = document.querySelectorAll(".scale-point");

  scalePoints.forEach((point) => {
    point.addEventListener(
      "touchstart",
      () => {
        if (point.classList.contains("chaos-point")) {
          // Chaos — double pulse
          navigator.vibrate([40, 30, 40]);
        } else {
          // Order — single clean pulse
          navigator.vibrate(25);
        }
      },
      { passive: true },
    );
  });

  // ── QUOTE BLOCK ENTRY ────────────────────

  /**
   * When a quote block scrolls into view
   * give a deep single pulse.
   */
  const quoteBlocks = document.querySelectorAll(".quote-block");

  const hapticObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigator.vibrate(50);
          hapticObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  quoteBlocks.forEach((block) => hapticObserver.observe(block));

  // ── SECTION DIVIDER CROSS ────────────────

  /**
   * Quick tick when scrolling past a section divider.
   */
  const dividers = document.querySelectorAll(".section-divider");

  const dividerHapticObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navigator.vibrate(15);
        }
      });
    },
    { threshold: 0.5 },
  );

  dividers.forEach((d) => dividerHapticObserver.observe(d));

  // ── SOUND BUTTON TAP ─────────────────────

  /**
   * Heavy double pulse on the sound button
   * since the Abyss is fighting back.
   */
  const soundBtn = document.getElementById("sound-toggle");

  if (soundBtn) {
    soundBtn.addEventListener(
      "touchstart",
      () => {
        navigator.vibrate([60, 40, 60]);
      },
      { passive: true },
    );
  }
}
