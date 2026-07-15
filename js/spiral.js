/* ============================================
   SPIRAL.JS
   Purpose: Animated spiral canvas background
            and floating particles
   Dependencies: None
   Affects: #spiral-bg, #particles
   ============================================ */

// ── SPIRAL CANVAS ──────────────────────────

const canvas = document.getElementById("spiral-bg");
const ctx = canvas.getContext("2d");

/**
 * Resize canvas to always fill the full viewport.
 * Called on init and on every window resize.
 */
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Angle offset that increments each frame to rotate the spiral
let spiralAngle = 0;

/**
 * Draw one frame of the spiral and schedule the next.
 * The spiral grows outward from the center of the viewport.
 */
function drawSpiral() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.beginPath();

  for (let i = 0; i < 800; i++) {
    const angle = 0.1 * i + spiralAngle;
    const radius = 2 * i * 0.3;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.strokeStyle = "rgba(139, 0, 0, 0.4)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Increment angle slowly for rotation effect
  spiralAngle += 0.002;

  requestAnimationFrame(drawSpiral);
}

// Kick off the animation loop
drawSpiral();

// ── FLOATING PARTICLES ──────────────────────

const particleContainer = document.getElementById("particles");
const PARTICLE_COUNT = 30;

/**
 * Create particles and append them to the container.
 * Each gets a random position, delay, and duration
 * so they never drift in sync.
 */
function createParticles() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    p.style.left = `${Math.random() * 100}%`;
    p.style.top = `${Math.random() * 100}%`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.animationDuration = `${6 + Math.random() * 6}s`;

    particleContainer.appendChild(p);
  }
}

createParticles();
