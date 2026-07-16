/* ============================================
   SCROLL.JS
   Purpose: Scroll progress bar, scroll-triggered
            reveal animations, timeline reveals,
            quote block reveals, spiral SVG trigger
   Dependencies: base.css, animations.css
   Affects: #progress-bar, .reveal, .quote-block,
            .timeline-item, .spiral-visual
   ============================================ */

// ── PROGRESS BAR ────────────────────────────

const progressBar = document.getElementById("progress-bar");

/**
 * Update the width of the progress bar based on
 * how far down the page the user has scrolled.
 */
function updateProgressBar() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;

  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateProgressBar, { passive: true });

// ── INTERSECTION OBSERVER SETUP ─────────────

/**
 * Shared observer options.
 * threshold: how much of the element must be visible
 * rootMargin: shrink the bottom of the viewport
 *             so reveals trigger slightly before center
 */
const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

// ── REVEAL ELEMENTS ──────────────────────────

/**
 * Watches .reveal elements.
 * Adds .visible class when they enter the viewport
 * which triggers the CSS transition in animations.css
 */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");

      // Stop watching once revealed — no need to re-trigger
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ── QUOTE BLOCKS ─────────────────────────────

/**
 * Watches .quote-block elements.
 * Adds .visible which triggers both the fade-in
 * and the animated left border glow in components.css
 */
const quoteObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      quoteObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".quote-block").forEach((el) => {
  quoteObserver.observe(el);
});

// ── TIMELINE ITEMS ───────────────────────────

/**
 * Watches .timeline-item elements.
 * Staggers the reveal by adding a delay based on
 * the item's index so they animate one after another.
 */
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger each item by 150ms times its position
        const items = document.querySelectorAll(".timeline-item");
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("visible");
          }, index * 150);
        });

        // Once triggered unobserve all items
        items.forEach((item) => timelineObserver.unobserve(item));
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px",
  },
);

// Only observe the first timeline item to trigger the cascade
const firstTimelineItem = document.querySelector(".timeline-item");
if (firstTimelineItem) {
  timelineObserver.observe(firstTimelineItem);
}

// ── SPIRAL SVG DRAW TRIGGER ──────────────────

/**
 * Watches the .spiral-visual container.
 * Adding .visible triggers the stroke-dashoffset
 * transition in sections.css which draws the spiral.
 */
const spiralObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        spiralObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.3,
  },
);

const spiralVisual = document.querySelector(".spiral-visual");
if (spiralVisual) {
  spiralObserver.observe(spiralVisual);
}

// ── NAV SCROLL STATE ─────────────────────────

/**
 * Adds .scrolled class to nav when user scrolls
 * past 50px. This triggers the solid background
 * style defined in nav.css
 */
const navbar = document.getElementById("navbar");

function updateNavState() {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavState, { passive: true });

// ── HERO PARALLAX ────────────────────────────

/**
 * Moves hero elements at different speeds on scroll
 * creating a depth effect. Only active on desktop.
 */
const heroContent = document.querySelector(".hero-content");
const heroSection = document.getElementById("hero");

function updateParallax() {
  if (!heroContent || !heroSection) return;

  // Only apply when hero is visible
  if (window.scrollY > window.innerHeight) return;

  const scrolled = window.scrollY;

  // Title moves slower — feels further away
  heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
  heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);

  // Scroll indicator fades faster
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    scrollIndicator.style.opacity = 1 - scrolled / (window.innerHeight * 0.3);
  }
}

// Only enable parallax on larger screens
if (window.innerWidth > 768) {
  window.addEventListener("scroll", updateParallax, { passive: true });
}

// ── SECTION DIVIDER GLITCH ───────────────────

/**
 * When a section divider scrolls into view
 * trigger a brief glitch flash effect.
 */
const dividers = document.querySelectorAll(".section-divider");

const dividerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("glitch-flash");

        // Remove class after animation so it can retrigger
        setTimeout(() => {
          entry.target.classList.remove("glitch-flash");
        }, 300);
      }
    });
  },
  {
    threshold: 0.5,
  },
);

dividers.forEach((divider) => dividerObserver.observe(divider));

// ── BACKGROUND COLOR SHIFT ──────────────────

/**
 * As the user scrolls deeper the background
 * gradually shifts from pure dark to a deep
 * blood red. Like descending into the Abyss.
 *
 * At 0% scroll:   #0a0a0f (abyss black)
 * At 50% scroll:  slight red tint
 * At 100% scroll: #1a0505 (deep blood)
 */
function updateBackgroundShift() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollTop / docHeight, 1);

  // Base color: rgb(10, 10, 15)
  // Target color: rgb(26, 5, 5)
  const r = Math.round(10 + 16 * progress);
  const g = Math.round(10 - 5 * progress);
  const b = Math.round(15 - 10 * progress);

  document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

  // Also shift the spiral canvas opacity
  // Gets slightly more visible as you scroll
  const canvas = document.getElementById("spiral-bg");
  if (canvas) {
    canvas.style.opacity = 0.15 + progress * 0.1;
  }

  // Section dividers get brighter
  const dividers = document.querySelectorAll(".section-divider");
  const glowIntensity = 0.3 + progress * 0.7;
  dividers.forEach((d) => {
    d.style.background = `linear-gradient(
            90deg,
            transparent,
            rgba(139, 0, 0, ${glowIntensity}),
            transparent
        )`;
  });

  // Update section divider diamond backgrounds
  // so they always match the current body color
  const diamonds = document.querySelectorAll(".section-divider");
  const bgColor = `rgb(${r}, ${g}, ${b})`;
  diamonds.forEach((d) => {
    d.style.setProperty("--divider-bg", bgColor);
  });
}

window.addEventListener("scroll", updateBackgroundShift, { passive: true });
