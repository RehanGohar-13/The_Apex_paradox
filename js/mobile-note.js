/* ============================================
   MOBILE-NOTE.JS
   Purpose: Show desktop recommendation on mobile
            Remember dismissal so it only shows once
   Dependencies: components.css
   Affects: #mobile-note
   ============================================ */

const mobileNote = document.getElementById("mobile-note");
const dismissBtn = document.getElementById("mobile-note-dismiss");
const hasBeenShown = localStorage.getItem("apex_mobile_note_dismissed");

if (!mobileNote || !dismissBtn) {
  // Elements not found — skip
} else if (hasBeenShown === "true") {
  // Already dismissed — remove immediately
  mobileNote.remove();
} else if (window.innerWidth > 1024) {
  // Desktop — remove immediately
  mobileNote.remove();
} else {
  // Mobile — show the note
  initMobileNote();
}

function initMobileNote() {
  // Block scrolling while note is visible
  document.body.style.overflow = "hidden";

  dismissBtn.addEventListener("click", () => {
    // Remember dismissal
    localStorage.setItem("apex_mobile_note_dismissed", "true");

    // Fade out
    mobileNote.style.transition = "opacity 0.6s ease";
    mobileNote.style.opacity = "0";

    // Unlock scrolling
    document.body.style.overflow = "";

    // Remove from DOM
    setTimeout(() => {
      mobileNote.remove();
    }, 600);
  });

  // Also dismiss on swipe up
  let touchStartY = 0;

  mobileNote.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.touches[0].clientY;
    },
    { passive: true },
  );

  mobileNote.addEventListener(
    "touchend",
    (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Swipe up more than 80px to dismiss
      if (diff > 80) {
        dismissBtn.click();
      }
    },
    { passive: true },
  );
}
