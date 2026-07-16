/* ============================================
   BREACH.JS
   Purpose: Full-screen flash when crossing
            between major sections
   Dependencies: components.css
   Affects: Creates #breach-flash element
   Note: Only triggers once per divider per
         page load. Subtle and brief.
   ============================================ */

// ── CREATE FLASH ELEMENT ─────────────────────

const flash = document.createElement("div");
flash.id = "breach-flash";
document.body.appendChild(flash);

// ── TRACK WHICH DIVIDERS HAVE FIRED ──────────

const firedDividers = new Set();

// ── OBSERVE DIVIDERS ─────────────────────────

const breachDividers = document.querySelectorAll(".section-divider");

const breachObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const divider = entry.target;
      const index = Array.from(breachDividers).indexOf(divider);

      // Only fire once per divider
      if (firedDividers.has(index)) return;
      firedDividers.add(index);

      triggerBreach();
    });
  },
  {
    threshold: 0.8,
  },
);

breachDividers.forEach((d) => breachObserver.observe(d));

// ── TRIGGER BREACH ───────────────────────────

function triggerBreach() {
  // Quick flash
  flash.classList.add("active");

  // Haptic on mobile
  if (navigator.vibrate) {
    navigator.vibrate(20);
  }

  setTimeout(() => {
    flash.classList.remove("active");
  }, 200);
}
