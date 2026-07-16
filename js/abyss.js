/* ============================================
   ABYSS.JS
   Purpose: Toggle between normal dark mode and
            an even darker "Abyss Mode"
   Dependencies: components.css, base.css
   Affects: body.abyss-mode, #abyss-toggle
   ============================================ */

// ── CREATE TOGGLE BUTTON ─────────────────────

const abyssBtn = document.createElement("button");
abyssBtn.id = "abyss-toggle";
abyssBtn.setAttribute("aria-label", "Toggle Abyss Mode");
abyssBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5"/>
        <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
`;

document.body.appendChild(abyssBtn);

// ── STATE ────────────────────────────────────

let isAbyssMode = localStorage.getItem("apex_abyss_mode") === "true";

// ── APPLY MODE ───────────────────────────────

function applyAbyssMode(active) {
  if (active) {
    document.body.classList.add("abyss-mode");
    abyssBtn.classList.add("active");
    localStorage.setItem("apex_abyss_mode", "true");
  } else {
    document.body.classList.remove("abyss-mode");
    abyssBtn.classList.remove("active");
    localStorage.setItem("apex_abyss_mode", "false");
  }
}

// Apply saved preference on load
applyAbyssMode(isAbyssMode);

// ── TOGGLE ───────────────────────────────────

abyssBtn.addEventListener("click", () => {
  isAbyssMode = !isAbyssMode;
  applyAbyssMode(isAbyssMode);
});
