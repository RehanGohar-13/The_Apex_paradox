/* ============================================
   LOADER.JS
   Purpose: Loading screen animation and dismiss
            Remembers returning visitors
   Dependencies: components.css
   Affects: #loader, #loader-bar-fill,
            #loader-percent, #loader-status,
            #loader-title, #loader-warning
   ============================================ */

// ── ELEMENTS ─────────────────────────────────

const loader = document.getElementById("loader");
const barFill = document.getElementById("loader-bar-fill");
const percentText = document.getElementById("loader-percent");
const statusText = document.getElementById("loader-status");
const titleText = document.querySelector(".loader-title");
const warningText = document.querySelector(".loader-warning");

// ── VISIT TRACKING ───────────────────────────

/**
 * Check localStorage to see if the user has
 * visited before. If yes, show a different
 * and more unsettling loader experience.
 */
const visitCount = parseInt(localStorage.getItem("apex_visits") || "0");
const isReturning = visitCount > 0;

// Increment and save visit count
localStorage.setItem("apex_visits", (visitCount + 1).toString());

// Save the timestamp of this visit
localStorage.setItem("apex_last_visit", Date.now().toString());

// ── RETURNING VISITOR SETUP ──────────────────

/**
 * Different messages based on how many times
 * the user has returned. Gets progressively
 * more unsettling.
 */

let statusMessages;

if (!isReturning) {
  // ── FIRST VISIT ──────────────────────────

  statusMessages = [
    { at: 0, text: "LOADING PARADOX..." },
    { at: 20, text: "MAPPING THE SPIRAL..." },
    { at: 40, text: "CALCULATING DEVIATION..." },
    { at: 60, text: "LOCATING THE CENTRE..." },
    { at: 75, text: "CENTRE NOT FOUND..." },
    { at: 88, text: "ABANDONING SEARCH..." },
    { at: 95, text: "APEX PROTOCOL READY" },
  ];
} else if (visitCount === 1) {
  // ── SECOND VISIT ─────────────────────────

  titleText.textContent = "YOU RETURNED";
  warningText.textContent = "⚠ THE SPIRAL REMEMBERS YOU";

  statusMessages = [
    { at: 0, text: "RECOGNISING VISITOR..." },
    { at: 15, text: "VISITOR IDENTIFIED." },
    { at: 30, text: "DID THE CENTRE CALL YOU BACK?" },
    { at: 50, text: "OR DID YOU NEVER LEAVE?" },
    { at: 70, text: "RELOADING THE SPIRAL..." },
    { at: 85, text: "IT GREW SINCE LAST TIME..." },
    { at: 95, text: "WELCOME BACK." },
  ];
} else if (visitCount === 2) {
  // ── THIRD VISIT ──────────────────────────

  titleText.textContent = "AGAIN?";
  warningText.textContent =
    "⚠ VISIT #" + (visitCount + 1) + " — YOU KEEP COMING BACK";

  statusMessages = [
    { at: 0, text: "YOU CANNOT STAY AWAY." },
    { at: 20, text: "THE SPIRAL HAS YOUR PATTERN." },
    { at: 40, text: "IT KNOWS WHEN YOU WILL RETURN." },
    { at: 60, text: "BEFORE YOU EVEN DECIDE TO." },
    { at: 80, text: "YOU ARE PART OF IT NOW." },
    { at: 95, text: "RESUMING..." },
  ];
} else if (visitCount <= 5) {
  // ── 4TH TO 6TH VISIT ────────────────────

  titleText.textContent = "VISIT #" + (visitCount + 1);
  warningText.textContent = "⚠ THE ABYSS IS PATIENT";

  statusMessages = [
    { at: 0, text: "IT EXPECTED YOU." },
    { at: 25, text: "YOU ARE PREDICTABLE NOW." },
    { at: 50, text: "THE SPIRAL DOES NOT NEED TO CALL." },
    { at: 75, text: "YOU COME ON YOUR OWN." },
    { at: 95, text: "..." },
  ];
} else if (visitCount <= 10) {
  // ── 7TH TO 11TH VISIT ───────────────

  titleText.textContent = "VISIT #" + (visitCount + 1);
  warningText.textContent = "";

  const silentMessages = [
    "It stopped counting.",
    "The Abyss already knows why you are here.",
    "You don't need a loading screen anymore.",
    "You ARE the loading screen.",
  ];

  // Pick a random one each time
  const picked =
    silentMessages[Math.floor(Math.random() * silentMessages.length)];

  statusMessages = [
    { at: 0, text: "..." },
    { at: 40, text: picked },
    { at: 90, text: "..." },
  ];
} else {
  // ── 12TH+ VISIT ─────────────────────
  // Truly silent. The Abyss is done speaking.

  titleText.textContent = "...";
  warningText.textContent = "";

  statusMessages = [
    { at: 0, text: "..." },
    { at: 95, text: "" },
  ];
}

// ── LOADER LOGIC ─────────────────────────────

let current = 0;

/**
 * Speed varies based on visit count.
 * Returning visitors get a faster loader
 * because the Abyss already knows them.
 */
const speedMultiplier = isReturning ? 1.5 : 1;

function runLoader() {
  let increment;

  if (current < 50) increment = 1.2 * speedMultiplier;
  else if (current < 80) increment = 0.8 * speedMultiplier;
  else if (current < 95) increment = 0.3 * speedMultiplier;
  else increment = 0.15 * speedMultiplier;

  current += increment;

  if (current >= 100) {
    current = 100;
    finish();
    return;
  }

  // Update bar width
  barFill.style.width = `${current}%`;

  // Update percent label
  percentText.textContent = `${Math.floor(current)}%`;

  // Update status message based on threshold
  statusMessages.forEach((msg) => {
    if (Math.floor(current) >= msg.at) {
      statusText.textContent = msg.text;
    }
  });

  // Schedule next tick
  const delay = current < 80 ? 30 : current < 95 ? 50 : 80;
  setTimeout(runLoader, delay);
}

/**
 * Called when progress hits 100.
 */
function finish() {
  barFill.style.width = "100%";
  percentText.textContent = "100%";

  // Different exit message for returning visitors
  if (isReturning) {
    statusText.textContent = "THE SPIRAL CONTINUES...";
  } else {
    statusText.textContent = "ENTERING THE ABYSS...";
  }

  setTimeout(() => {
    loader.classList.add("hidden");

    loader.addEventListener(
      "transitionend",
      () => {
        loader.remove();
      },
      { once: true },
    );
  }, 600);
}

// ── START ────────────────────────────────────

window.addEventListener("load", () => {
  setTimeout(runLoader, 400);
});
