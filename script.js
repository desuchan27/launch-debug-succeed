const phaseText = document.getElementById("phaseText");
const actionBtn = document.getElementById("actionBtn");
const bugEls = [
  document.getElementById("bug1"),
  document.getElementById("bug2"),
  document.getElementById("bug3"),
];
const explodeEls = [
  document.getElementById("explode1"),
  document.getElementById("explode2"),
  document.getElementById("explode3"),
];
const hitEl = document.getElementById("hit");
const screen = document.getElementById("screen");

let state = "launch";

function setPhase(text) {
  phaseText.style.opacity = "0";
  setTimeout(() => {
    phaseText.textContent = text;
    phaseText.style.opacity = "1";
  }, 150);
}

actionBtn.addEventListener("click", () => {
  if (state !== "launch") return;
  state = "debug";

  actionBtn.disabled = true;
  setPhase("DEBUG");

  document.querySelector(".cloud-left").classList.add("looping");
  document.querySelector(".cloud-right").classList.add("looping");

  fireHitSequence();
});

function fireHitSequence() {
  const screenH = screen.offsetHeight;
  const startBottom = screenH * 0.12;
  const pauseBottom = screenH * 0.4; // Mid-air pause point
  const endBottom = screenH * 0.8;

  hitEl.style.bottom = startBottom + "px";
  hitEl.style.removeProperty("top");
  hitEl.style.position = "absolute";
  hitEl.style.left = "50%";
  hitEl.style.transform = "translateX(-50%)";
  hitEl.style.transition = "none";
  hitEl.classList.remove("hidden");

  hitEl.getBoundingClientRect();

  // Shoot halfway and pause
  const launchDuration = 400;

  hitEl.style.transition = `bottom ${launchDuration}ms ease-out`;
  hitEl.style.bottom = pauseBottom + "px";

  setTimeout(() => {
    const plane = document.getElementById("plane");
    plane.classList.add("slide-out");

    const cloudLoopDelay = 2000;

    setTimeout(() => {
      // Bugs drop in from the top
      bugEls.forEach((b) => b.classList.add("show"));

      // Wait 1200ms for bugs to fully drop in and bounce before striking
      const aimDelay = 1200;

      setTimeout(() => {
        const strikeDuration = 300;

        hitEl.style.transition = `bottom ${strikeDuration}ms ease-in`;
        hitEl.style.bottom = endBottom + "px";

        setTimeout(() => {
          hitEl.classList.add("hidden");
          showExplode();
        }, strikeDuration);
      }, aimDelay);
    }, cloudLoopDelay);
  }, launchDuration);
}

function showExplode() {
  // Hide all bugs
  bugEls.forEach((b) => {
    b.classList.remove("show");
    b.classList.add("hidden");
  });

  explodeEls.forEach((ex) => {
    ex.classList.remove("hidden");
    ex.style.animation = "none";
    ex.getBoundingClientRect();
    ex.style.animation = "explodePop 0.3s steps(1) forwards";
  });

  setTimeout(() => {
    explodeEls.forEach((ex) => {
      ex.style.transition = "opacity 0.5s";
      ex.style.opacity = "0";
    });

    setTimeout(() => {
      explodeEls.forEach((ex) => {
        ex.classList.add("hidden");
        ex.style.opacity = "";
        ex.style.transition = "";
      });
    }, 520);

    const plane = document.getElementById("plane");
    plane.classList.remove("slide-out");

    setTimeout(() => {
      document.querySelector(".cloud-left").classList.remove("looping");
      document.querySelector(".cloud-right").classList.remove("looping");

      state = "succeed";
      setPhase("SUCCEED");
    }, 800);
  }, 600);
}
