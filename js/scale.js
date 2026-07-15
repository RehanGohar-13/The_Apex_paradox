/* ============================================
   SCALE.JS
   Purpose: Apex Scale hover interactions
   Dependencies: sections.css
   Affects: .scale-point, #scale-info,
            #scale-info-text, #scale-line-fill
   ============================================ */

// ── ELEMENTS ─────────────────────────────────

const scalePoints = document.querySelectorAll(".scale-point");
const scaleInfo = document.getElementById("scale-info");
const scaleInfoText = document.getElementById("scale-info-text");
const scaleLineFill = document.getElementById("scale-line-fill");
const apexScale = document.getElementById("apex-scale");

if (!apexScale) {
  console.warn("SCALE: #apex-scale not found — skipping.");
} else {
  initScale();
}

function initScale() {
  const defaultLabel = "HOVER A POINT TO EXAMINE";
  const defaultText = "Each point represents a revolution of the spiral.";

  // ── HOVER HANDLERS ───────────────────────

  scalePoints.forEach((point, index) => {
    // Mouse enter — show this point's info
    point.addEventListener("mouseenter", () => {
      const info = point.getAttribute("data-info");

      // Update info box
      scaleInfoText.textContent = info;
      document.querySelector(".scale-info-label").textContent =
        `POINT ${index + 1} OF ${scalePoints.length} — EXAMINING`;
      scaleInfo.classList.add("active");

      // Update line fill to show progress
      const progress = ((index + 1) / scalePoints.length) * 100;
      scaleLineFill.style.width = progress + "%";
    });

    // Mouse leave — reset to default
    point.addEventListener("mouseleave", () => {
      scaleInfoText.textContent = defaultText;
      document.querySelector(".scale-info-label").textContent = defaultLabel;
      scaleInfo.classList.remove("active");
    });

    // Touch support — tap to toggle
    point.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const info = point.getAttribute("data-info");
      scaleInfoText.textContent = info;
      document.querySelector(".scale-info-label").textContent =
        `POINT ${index + 1} OF ${scalePoints.length} — EXAMINING`;
      scaleInfo.classList.add("active");

      const progress = ((index + 1) / scalePoints.length) * 100;
      scaleLineFill.style.width = progress + "%";
    });
  });

  // ── SCROLL TRIGGER FOR LINE FILL ─────────

  /**
   * When the scale scrolls into view animate
   * the line fill to 100% as a preview then
   * reset it so hover takes over.
   */
  const scaleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          apexScale.classList.add("visible");
          scaleObserver.unobserve(entry.target);

          // After initial fill animation reset for hover
          setTimeout(() => {
            scaleLineFill.style.transition = "width 0.4s ease";
            scaleLineFill.style.width = "0%";
          }, 2000);
        }
      });
    },
    { threshold: 0.3 },
  );

  scaleObserver.observe(apexScale);
}
