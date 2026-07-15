/* ============================================
   SOUND.JS
   Purpose: Ambient drone that starts automatically
            and resists being turned off
   Dependencies: components.css (#sound-toggle)
   Affects: #sound-toggle, #sound-message
   Note: Sound auto-starts after loader finishes
         Pressing the button triggers messages
         The Abyss does not let go easily
   ============================================ */

// ── ELEMENTS ─────────────────────────────────

const soundBtn = document.getElementById("sound-toggle");

if (!soundBtn) {
  console.warn("SOUND: #sound-toggle not found — skipping.");
} else {
  initSound();
}

function initSound() {
  let audioCtx = null;
  let masterGain = null;
  let nodes = [];
  let isPlaying = false;
  let clickCount = 0;
  let hasStarted = false;
  let messageEl = null;
  let messageTimer = null;

  // ── MESSAGES ─────────────────────────────

  /**
   * Each press of the button shows the next message.
   * They get progressively more unsettling.
   * The sound never actually stops until the last one.
   */
  const messages = [
    "Who said you were in control?",
    "The Abyss does not have a mute button.",
    "You built the machine. You don't get to silence it.",
    "It hears you trying.",
    "The spiral does not stop because you asked.",
    "You are not the pilot anymore.",
    "Did you really think pressing a button would save you?",
    "This is the sound of something watching you.",
    "Stop resisting.",
    "Fine. But it remembers.",
  ];

  // ── CREATE MESSAGE ELEMENT ───────────────

  function createMessageEl() {
    messageEl = document.createElement("div");
    messageEl.id = "sound-message";
    document.body.appendChild(messageEl);
  }

  createMessageEl();

  // ── SHOW MESSAGE ─────────────────────────

  function showMessage(text) {
    if (messageTimer) clearTimeout(messageTimer);

    messageEl.textContent = text;
    messageEl.classList.remove("visible");

    // Force reflow to restart animation
    void messageEl.offsetWidth;

    messageEl.classList.add("visible");

    // Hide after some time — longer for later messages
    const duration = 3000 + clickCount * 300;
    messageTimer = setTimeout(() => {
      messageEl.classList.remove("visible");
    }, duration);
  }

  // ── CREATE THE DRONE ─────────────────────

  function createDrone() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Layer 1: Deep sub bass
    const sub = audioCtx.createOscillator();
    const subGain = audioCtx.createGain();
    sub.type = "sine";
    sub.frequency.value = 38;
    subGain.gain.value = 0.5;
    sub.connect(subGain);
    subGain.connect(masterGain);
    sub.start();
    nodes.push(sub);

    // Layer 2: Low hum with vibrato
    const hum = audioCtx.createOscillator();
    const humGain = audioCtx.createGain();
    hum.type = "sine";
    hum.frequency.value = 75;
    humGain.gain.value = 0.35;
    hum.connect(humGain);
    humGain.connect(masterGain);
    hum.start();
    nodes.push(hum);

    const humLFO = audioCtx.createOscillator();
    const humLFOGain = audioCtx.createGain();
    humLFO.type = "sine";
    humLFO.frequency.value = 0.25;
    humLFOGain.gain.value = 3;
    humLFO.connect(humLFOGain);
    humLFOGain.connect(hum.frequency);
    humLFO.start();
    nodes.push(humLFO);

    // Layer 3: Mid dark tone
    const tone = audioCtx.createOscillator();
    const toneGain = audioCtx.createGain();
    tone.type = "triangle";
    tone.frequency.value = 110;
    toneGain.gain.value = 0.2;
    tone.connect(toneGain);
    toneGain.connect(masterGain);
    tone.start();
    nodes.push(tone);

    const toneLFO = audioCtx.createOscillator();
    const toneLFOGain = audioCtx.createGain();
    toneLFO.type = "sine";
    toneLFO.frequency.value = 0.08;
    toneLFOGain.gain.value = 8;
    toneLFO.connect(toneLFOGain);
    toneLFOGain.connect(tone.frequency);
    toneLFO.start();
    nodes.push(toneLFO);

    // Layer 4: Upper eerie tone
    const eerie = audioCtx.createOscillator();
    const eerieGain = audioCtx.createGain();
    eerie.type = "sawtooth";
    eerie.frequency.value = 220;
    eerieGain.gain.value = 0.04;
    eerie.connect(eerieGain);
    eerieGain.connect(masterGain);
    eerie.start();
    nodes.push(eerie);

    const eerieLFO = audioCtx.createOscillator();
    const eerieLFOGain = audioCtx.createGain();
    eerieLFO.type = "sine";
    eerieLFO.frequency.value = 0.03;
    eerieLFOGain.gain.value = 15;
    eerieLFO.connect(eerieLFOGain);
    eerieLFOGain.connect(eerie.frequency);
    eerieLFO.start();
    nodes.push(eerieLFO);

    // Layer 5: Filtered noise — louder
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(
      1,
      bufferSize,
      audioCtx.sampleRate,
    );
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    const noiseGain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    noise.buffer = noiseBuffer;
    noise.loop = true;

    filter.type = "lowpass";
    filter.frequency.value = 300;
    filter.Q.value = 1.5;

    noiseGain.gain.value = 0.12;

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();
    nodes.push(noise);

    const filterLFO = audioCtx.createOscillator();
    const filterLFOGain = audioCtx.createGain();
    filterLFO.type = "sine";
    filterLFO.frequency.value = 0.04;
    filterLFOGain.gain.value = 150;
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(filter.frequency);
    filterLFO.start();
    nodes.push(filterLFO);
  }

  // ── FADE IN ──────────────────────────────

  function fadeIn(duration, volume) {
    if (!audioCtx) createDrone();

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(
      volume,
      audioCtx.currentTime + duration,
    );

    isPlaying = true;
  }

  // ── FADE OUT ─────────────────────────────

  function fadeOut(duration) {
    if (!audioCtx || !masterGain) return;

    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);

    isPlaying = false;
  }

  // ── FULL STOP ────────────────────────────

  function fullStop() {
    if (!audioCtx) return;

    fadeOut(2);

    setTimeout(() => {
      nodes.forEach((node) => {
        try {
          node.stop();
        } catch (e) {
          /* ok */
        }
      });
      audioCtx.close();
      audioCtx = null;
      nodes = [];
      isPlaying = false;
    }, 2500);
  }

  // ── AUTO START ───────────────────────────

  /**
   * Start the drone automatically after the loader
   * finishes. Uses a click listener as a fallback
   * because browsers block autoplay without interaction.
   */
  function autoStart() {
    if (hasStarted) return;
    hasStarted = true;

    fadeIn(3, 0.8);
    document.getElementById("sound-waves").style.display = "";
    document.getElementById("sound-mute").style.display = "none";
    soundBtn.classList.add("active");
  }

  // Try to start after loader
  const loader = document.getElementById("loader");

  if (loader) {
    const loaderObserver = new MutationObserver(() => {
      if (loader.classList.contains("hidden") || !document.contains(loader)) {
        loaderObserver.disconnect();
        setTimeout(autoStart, 500);
      }
    });

    loaderObserver.observe(loader, {
      attributes: true,
      attributeFilter: ["class"],
    });

    if (loader.classList.contains("hidden")) {
      loaderObserver.disconnect();
      setTimeout(autoStart, 500);
    }
  } else {
    window.addEventListener("load", () => {
      setTimeout(autoStart, 1000);
    });
  }

  // Fallback — if autoplay was blocked start on first click anywhere
  document.addEventListener(
    "click",
    () => {
      if (!hasStarted) {
        autoStart();
      }
    },
    { once: false },
  );

  // ── BUTTON CLICK HANDLER ─────────────────

  soundBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    clickCount++;

    // Sound is already dead — show post-death messages
    if (clickCount > messages.length) {
      const deadMessages = [
        "It's gone. You got what you wanted.",
        "The silence is worse, isn't it?",
        "You can't bring it back.",
        "The Abyss doesn't give second chances.",
        "Stop clicking. There's nothing left.",
        "You are alone now.",
        "...",
        "",
      ];

      const deadIndex = clickCount - messages.length - 1;

      if (deadIndex < deadMessages.length) {
        if (deadMessages[deadIndex] === "") {
          // Final click — hide the button entirely
          messageEl.classList.remove("visible");
          soundBtn.style.transition = "opacity 2s ease";
          soundBtn.style.opacity = "0";
          soundBtn.style.pointerEvents = "none";
          setTimeout(() => {
            soundBtn.remove();
          }, 2000);
        } else {
          showMessage(deadMessages[deadIndex]);
        }
      }
      return;
    }

    // Last message — actually stop the sound
    if (clickCount >= messages.length) {
      showMessage(messages[messages.length - 1]);
      document.getElementById("sound-waves").style.display = "none";
      document.getElementById("sound-mute").style.display = "";
      soundBtn.classList.remove("active");
      fullStop();
      return;
    }

    // Show the message
    showMessage(messages[clickCount - 1]);

    // Sound reacts but does not stop
    if (clickCount <= 3) {
      // First few clicks — volume dips briefly then comes back
      fadeOut(0.5);
      setTimeout(() => {
        fadeIn(1.5, 0.8);
      }, 600);
    } else if (clickCount <= 6) {
      // Middle clicks — volume dips lower but comes back louder
      fadeOut(0.3);
      setTimeout(() => {
        fadeIn(1, 0.9);
      }, 400);
    } else {
      // Late clicks — barely flinches
      fadeOut(0.15);
      setTimeout(() => {
        fadeIn(0.5, 1.0);
      }, 200);
    }

    // Update button icon to show struggle
    document.getElementById("sound-waves").style.display = "";
    document.getElementById("sound-mute").style.display = "none";
    soundBtn.classList.add("active");
  });

  // ── TAB VISIBILITY ───────────────────────

  document.addEventListener("visibilitychange", () => {
    if (!audioCtx) return;

    if (document.hidden && isPlaying) {
      audioCtx.suspend();
    } else if (!document.hidden && isPlaying) {
      audioCtx.resume();
    }
  });

  // ── CLEANUP ──────────────────────────────

  window.addEventListener("beforeunload", () => {
    if (audioCtx) {
      nodes.forEach((node) => {
        try {
          node.stop();
        } catch (e) {
          /* ok */
        }
      });
      audioCtx.close();
    }
  });
}
