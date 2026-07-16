/* ============================================
   MOBILE.JS
   Purpose: Handle all touch interactions that
            replace hover on mobile devices
   Dependencies: sections.css, components.css
   Affects: Scale points, glossary, comparison
            cards, diagram, corollaries
   Note: Only runs on touch devices
   ============================================ */

// ── DEVICE CHECK ─────────────────────────────

const isTouch =
  window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;

if (!isTouch) {
  // Desktop — do nothing, hover works fine
} else {
  initMobile();
}

function initMobile() {
  // Add mobile class to body for CSS hooks
  document.body.classList.add("is-mobile");

  // ── SCALE POINTS — TAP TO SHOW ──────────

  const scalePoints = document.querySelectorAll(".scale-point");
  const scaleInfo = document.getElementById("scale-info");
  const scaleInfoText = document.getElementById("scale-info-text");
  const scaleLabel = document.querySelector(".scale-info-label");
  let activeScale = null;

  scalePoints.forEach((point, index) => {
    point.addEventListener("click", (e) => {
      // Don't navigate on final point tap — need double tap
      if (point.classList.contains("final-point")) {
        if (activeScale === point) {
          // Second tap — navigate to void
          return;
        }
      }

      e.stopPropagation();

      const info = point.getAttribute("data-info");

      // Toggle — tap same point to close
      if (activeScale === point) {
        resetScale();
        return;
      }

      // Remove active from previous
      if (activeScale) {
        activeScale.classList.remove("mobile-active");
      }

      // Set new active
      activeScale = point;
      point.classList.add("mobile-active");

      if (scaleInfoText) {
        scaleInfoText.textContent = info;
      }
      if (scaleLabel) {
        scaleLabel.textContent = `POINT ${index + 1} OF ${scalePoints.length} — EXAMINING`;
      }
      if (scaleInfo) {
        scaleInfo.classList.add("active");
      }
    });
  });

  function resetScale() {
    if (activeScale) {
      activeScale.classList.remove("mobile-active");
      activeScale = null;
    }
    if (scaleInfoText) {
      scaleInfoText.textContent = "Tap a point to examine it.";
    }
    if (scaleLabel) {
      scaleLabel.textContent = "TAP A POINT TO EXAMINE";
    }
    if (scaleInfo) {
      scaleInfo.classList.remove("active");
    }
  }

  // Tap outside scale to close
  document.addEventListener("click", (e) => {
    if (activeScale && !e.target.closest(".apex-scale")) {
      resetScale();
    }
  });

  // ── GLOSSARY CARDS — TAP TO EXPAND ───────

  const glossaryItems = document.querySelectorAll(".glossary-item");
  let activeGlossary = null;

  glossaryItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Toggle
      if (activeGlossary === item) {
        item.classList.remove("mobile-active");
        activeGlossary = null;
        return;
      }

      // Remove previous
      if (activeGlossary) {
        activeGlossary.classList.remove("mobile-active");
      }

      // Set new
      activeGlossary = item;
      item.classList.add("mobile-active");
    });
  });

  // ── COROLLARY ITEMS — TAP HIGHLIGHT ──────

  const corollaryItems = document.querySelectorAll(".corollary-item");
  let activeCorollary = null;

  corollaryItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (activeCorollary === item) {
        item.classList.remove("mobile-active");
        activeCorollary = null;
        return;
      }

      if (activeCorollary) {
        activeCorollary.classList.remove("mobile-active");
      }

      activeCorollary = item;
      item.classList.add("mobile-active");
    });
  });

  // ── DIAGRAM NODES — TAP PULSE ────────────

  const diagramNodes = document.querySelectorAll(".diagram-node");

  diagramNodes.forEach((node) => {
    node.addEventListener("click", () => {
      node.classList.add("mobile-pulse");

      setTimeout(() => {
        node.classList.remove("mobile-pulse");
      }, 400);

      // Haptic
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    });
  });

  // ── COMPARISON CARDS — TAP HIGHLIGHT ─────

  const compCards = document.querySelectorAll(".comparison-card");
  let activeCard = null;

  compCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (activeCard === card) {
        card.classList.remove("mobile-active");
        activeCard = null;
        return;
      }

      if (activeCard) {
        activeCard.classList.remove("mobile-active");
      }

      activeCard = card;
      card.classList.add("mobile-active");
    });
  });
}
