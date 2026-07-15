/* ============================================
   AUTHOR.JS
   Purpose: Author corner panel toggle
   Dependencies: components.css
   Affects: #author-toggle, #author-content,
            #author-close
   ============================================ */

const authorToggle = document.getElementById("author-toggle");
const authorContent = document.getElementById("author-content");
const authorClose = document.getElementById("author-close");

if (!authorToggle || !authorContent) {
  console.warn("AUTHOR: Elements not found — skipping.");
} else {
  initAuthor();
}

function initAuthor() {
  let isOpen = false;

  // Toggle panel on button click
  authorToggle.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
      authorContent.classList.add("open");
    } else {
      authorContent.classList.remove("open");
    }
  });

  // Close on X click
  authorClose.addEventListener("click", () => {
    isOpen = false;
    authorContent.classList.remove("open");
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!isOpen) return;

    const panel = document.getElementById("author-panel");
    const inside = panel.contains(e.target);

    if (!inside) {
      isOpen = false;
      authorContent.classList.remove("open");
    }
  });

  // Close on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      isOpen = false;
      authorContent.classList.remove("open");
    }
  });
}
