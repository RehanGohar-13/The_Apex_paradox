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
  // Elements not found
} else if (hasBeenShown === "true") {
  mobileNote.remove();
} else if (window.innerWidth > 1024) {
  mobileNote.remove();
} else {
  initMobileNote();
}

function initMobileNote() {
  document.body.style.overflow = "hidden";

  dismissBtn.addEventListener("click", () => {
    localStorage.setItem("apex_mobile_note_dismissed", "true");

    mobileNote.style.transition = "opacity 0.6s ease";
    mobileNote.style.opacity = "0";

    document.body.style.overflow = "";

    setTimeout(() => {
      mobileNote.remove();
    }, 600);
  });

  // Swipe up to dismiss
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

      if (diff > 80) {
        dismissBtn.click();
      }
    },
    { passive: true },
  );
}
