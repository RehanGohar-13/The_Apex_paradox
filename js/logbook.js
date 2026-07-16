/* ============================================
   LOGBOOK.JS
   Purpose: Tracks which sections the user has
            read and shows completion percentage
   Dependencies: components.css
   Affects: Creates #logbook-indicator element
   ============================================ */

// ── CONFIG ───────────────────────────────────

const SECTIONS = [
  "description",
  "apex-scale-section",
  "paradox",
  "explanation",
  "example",
  "notes",
  "glossary",
  "questions",
];

const SECTION_LABELS = {
  description: "DESCRIPTION",
  "apex-scale-section": "APEX SCALE",
  paradox: "PARADOX",
  explanation: "EXPLANATION",
  example: "EXAMPLE",
  notes: "NOTES",
  glossary: "GLOSSARY",
  questions: "QUESTIONS",
};

// ── STATE ────────────────────────────────────

/**
 * Load previously read sections from localStorage.
 */
let readSections = JSON.parse(
  localStorage.getItem("apex_read_sections") || "[]",
);

// ── CREATE UI ────────────────────────────────

const logbook = document.createElement("div");
logbook.id = "logbook-indicator";

function updateLogbookUI() {
  const total = SECTIONS.length;
  const read = readSections.length;
  const percent = Math.round((read / total) * 100);

  let dotsHTML = "";

  SECTIONS.forEach((id) => {
    const isRead = readSections.includes(id);
    const label = SECTION_LABELS[id] || id.toUpperCase();
    dotsHTML += `
            <div class="logbook-dot ${isRead ? "read" : ""}"
                 title="${label}">
                <span class="logbook-dot-label">${label}</span>
            </div>
        `;
  });

  logbook.innerHTML = `
        <div class="logbook-header">
            <span class="logbook-title">LOGBOOK</span>
            <span class="logbook-percent">${percent}%</span>
        </div>
        <div class="logbook-dots">
            ${dotsHTML}
        </div>
        <div class="logbook-bar-track">
            <div class="logbook-bar-fill"></div>
        </div>
        <div class="logbook-status">
            ${
              read === total
                ? "TRANSMISSION FULLY RECEIVED"
                : `${read} OF ${total} SECTIONS OBSERVED`
            }
        </div>
    `;

  // Set bar fill based on expanded or collapsed state
  requestAnimationFrame(() => {
    const fill = logbook.querySelector(".logbook-bar-fill");
    if (fill) {
      if (logbook.classList.contains("expanded")) {
        fill.style.width = percent + "%";
        fill.style.height = "100%";
      } else {
        fill.style.height = percent + "%";
        fill.style.width = "100%";
      }
    }
  });

  localStorage.setItem("apex_read_sections", JSON.stringify(readSections));
}

updateLogbookUI();
document.body.appendChild(logbook);

// ── TOGGLE LOGBOOK ───────────────────────────

let logbookOpen = false;

logbook.addEventListener("click", () => {
  logbookOpen = !logbookOpen;

  if (logbookOpen) {
    logbook.classList.add("expanded");
  } else {
    logbook.classList.remove("expanded");
  }

  // Re-render to switch bar direction
  updateLogbookUI();

  // Maintain state
  if (logbookOpen) {
    logbook.classList.add("expanded");
  }
});

// ── TRACK READING ────────────────────────────

/**
 * Mark a section as read when ANY part of it
 * is visible in the viewport. Uses a low threshold
 * so even partial visibility counts.
 *
 * Also re-checks on every scroll to catch sections
 * the user scrolled past quickly or landed on
 * after a refresh.
 */

function observeSections() {
  SECTIONS.forEach((id) => {
    // Skip already read sections
    if (readSections.includes(id)) return;

    const section = document.getElementById(id);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !readSections.includes(id)) {
            readSections.push(id);
            updateLogbookUI();

            if (logbookOpen) {
              logbook.classList.add("expanded");
            }

            observer.unobserve(section);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(section);
  });
}

observeSections();

/**
 * Fallback — on scroll check all sections manually.
 * Catches edge cases where IntersectionObserver
 * misses sections on page refresh mid-scroll.
 */
function manualSectionCheck() {
  let updated = false;

  SECTIONS.forEach((id) => {
    if (readSections.includes(id)) return;

    const section = document.getElementById(id);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const inView =
      rect.top < window.innerHeight * 0.8 &&
      rect.bottom > window.innerHeight * 0.2;

    if (inView) {
      readSections.push(id);
      updated = true;
    }
  });

  if (updated) {
    updateLogbookUI();
    if (logbookOpen) {
      logbook.classList.add("expanded");
    }
  }
}

// Run manual check on scroll
window.addEventListener("scroll", manualSectionCheck, { passive: true });

// Also run once on load after a short delay
// to catch whatever section is visible on refresh
setTimeout(manualSectionCheck, 1000);
