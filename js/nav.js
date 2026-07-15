/* ============================================
   NAV.JS
   Purpose: Hamburger menu toggle, smooth scroll,
            active nav link highlighting
   Dependencies: nav.css
   Affects: #navbar, .hamburger, .nav-links
   ============================================ */

// ── HAMBURGER MENU ───────────────────────────

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

/**
 * Toggle the mobile nav open and closed.
 * .active on hamburger triggers the X animation.
 * .open on nav-links slides the panel in.
 */
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");

  // Prevent body scroll when nav is open
  document.body.style.overflow = navLinks.classList.contains("open")
    ? "hidden"
    : "";
});

/**
 * Close the mobile nav when any link is clicked.
 * Without this the nav stays open after navigation.
 */
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  });
});

/**
 * Close nav if user clicks outside of it on mobile.
 */
document.addEventListener("click", (e) => {
  const isOpen = navLinks.classList.contains("open");
  const clickedNav = navLinks.contains(e.target);
  const clickedBtn = hamburger.contains(e.target);

  if (isOpen && !clickedNav && !clickedBtn) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// ── SMOOTH SCROLL ────────────────────────────

/**
 * Intercept all anchor clicks that point to an
 * on-page ID and scroll smoothly instead of jumping.
 * Offsets for the fixed nav height (70px).
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const target = document.querySelector(targetId);

    if (target) {
      const navHeight = document.querySelector("nav").offsetHeight;
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  });
});

// ── ACTIVE LINK HIGHLIGHTING ─────────────────

/**
 * Highlights the nav link that corresponds to the
 * section currently in view using IntersectionObserver.
 */
const sections = document.querySelectorAll("section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");

const activeLinkObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Remove active from all links
        navAnchors.forEach((a) => a.classList.remove("active"));

        // Add active to the matching link
        const activeLink = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`,
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  },
  {
    threshold: 0.4,
    rootMargin: "-80px 0px 0px 0px",
  },
);

sections.forEach((section) => activeLinkObserver.observe(section));

// ── ADD ACTIVE LINK STYLE ────────────────────

/**
 * Inject the active link style directly.
 * Keeps it here so it is managed alongside the logic
 * that controls it rather than being buried in CSS.
 */
const activeStyle = document.createElement("style");
activeStyle.textContent = `
    .nav-links a.active {
        color: var(--glow);
    }
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(activeStyle);
