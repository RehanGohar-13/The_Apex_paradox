/* ============================================
   KONAMI.JS
   Purpose: Hidden easter egg triggered by the
            Konami Code sequence
            ↑ ↑ ↓ ↓ ← → ← → B A
   Dependencies: None
   Affects: Creates a full-screen takeover overlay
   ============================================ */

// ── THE SEQUENCE ─────────────────────────────

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

let konamiIndex = 0;
let konamiTriggered = false;

// ── LISTENER ─────────────────────────────────

document.addEventListener("keydown", (e) => {
  if (konamiTriggered) return;

  const expected = KONAMI_CODE[konamiIndex];

  if (e.code === expected) {
    konamiIndex++;

    if (konamiIndex === KONAMI_CODE.length) {
      konamiTriggered = true;
      triggerAbyss();
    }
  } else {
    // Reset if wrong key
    konamiIndex = 0;

    // Check if the wrong key is actually the start
    if (e.code === KONAMI_CODE[0]) {
      konamiIndex = 1;
    }
  }
});

// ── THE TAKEOVER ─────────────────────────────

function triggerAbyss() {
  // Vibrate on mobile if supported
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 200, 100, 300]);
  }

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "konami-overlay";

  overlay.innerHTML = `
        <div class="konami-content">
            <div class="konami-glitch-text" data-text="YOU FOUND IT">YOU FOUND IT</div>
            <div class="konami-sub">BUT FINDING IS NOT THE SAME AS UNDERSTANDING</div>
            <div class="konami-divider"></div>
            <div class="konami-messages">
                <span>There are doors in this paradox that were never meant to be opened.</span>
                <span>You typed a sequence. A ritual. A key.</span>
                <span>The machine noticed.</span>
                <span>It does not reward curiosity.</span>
                <span>It catalogues it.</span>
                <span>You are now part of the data.</span>
            </div>
            <div class="konami-spiral">◉</div>
            <div class="konami-close">
                <span class="konami-close-text">[PRESS ESCAPE TO LOOK AWAY]</span>
            </div>
        </div>
    `;

  document.body.appendChild(overlay);

  // Force reflow then add visible class
  void overlay.offsetWidth;
  overlay.classList.add("visible");

  // Disable scrolling
  document.body.style.overflow = "hidden";

  // Animate messages in sequence
  const msgs = overlay.querySelectorAll(".konami-messages span");
  msgs.forEach((msg, i) => {
    setTimeout(
      () => {
        msg.classList.add("show");
      },
      2000 + i * 1500,
    );
  });

  // Show close hint after all messages
  setTimeout(
    () => {
      overlay.querySelector(".konami-close").classList.add("show");
    },
    2000 + msgs.length * 1500 + 1000,
  );

  // Close on Escape
  function closeOverlay(e) {
    if (e.key === "Escape") {
      overlay.classList.remove("visible");
      overlay.classList.add("closing");

      document.body.style.overflow = "";

      setTimeout(() => {
        overlay.remove();
      }, 1000);

      document.removeEventListener("keydown", closeOverlay);
    }
  }

  document.addEventListener("keydown", closeOverlay);
}
