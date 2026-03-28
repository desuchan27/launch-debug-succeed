const phaseText = document.getElementById("phaseText");
const actionBtn = document.getElementById("actionBtn");
const resetBtn = document.getElementById("resetBtn");
const gameboyWrapper = document.getElementById("gameboyWrapper");
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
const plane = document.getElementById("plane");

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
  resetBtn.classList.add("hidden"); 
  setPhase("DEBUG");

  document.querySelector(".cloud-left").classList.add("looping");
  document.querySelector(".cloud-right").classList.add("looping");

  fireHitSequence();
});


resetBtn.addEventListener("click", () => {
  if (state !== "succeed") return; 

  gameboyWrapper.classList.add("shake-hard");
  screen.classList.add("glitch-flash");


  setPhase("LAUNCH");


  plane.style.transition = 'none';
  plane.classList.remove("slide-out");
  
  bugEls.forEach(b => {
    b.style.transition = 'none'; 
    b.classList.remove("show");
    b.classList.remove("hidden");
  });

  setTimeout(() => {
    gameboyWrapper.classList.remove("shake-hard");
    screen.classList.remove("glitch-flash");
    
    plane.style.transition = '';
    bugEls.forEach(b => b.style.transition = '');
    
    state = "launch";
    actionBtn.disabled = false;
    resetBtn.classList.add("hidden");
  }, 400);
});

function fireHitSequence() {
  const screenH = screen.offsetHeight;
  const startBottom = screenH * 0.12;
  const pauseBottom = screenH * 0.4; 
  const endBottom = screenH * 0.8;

  hitEl.style.bottom = startBottom + "px";
  hitEl.style.removeProperty("top");
  hitEl.style.position = "absolute";
  hitEl.style.left = "50%";
  hitEl.style.transform = "translateX(-50%)";
  hitEl.style.transition = "none";
  hitEl.classList.remove("hidden");

  hitEl.getBoundingClientRect(); 

  const launchDuration = 400;

  hitEl.style.transition = `bottom ${launchDuration}ms ease-out`;
  hitEl.style.bottom = pauseBottom + "px";

  setTimeout(() => {
    plane.classList.add("slide-out");

    const cloudLoopDelay = 2000;

    setTimeout(() => {
      bugEls.forEach((b) => b.classList.add("show"));

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

    plane.classList.remove("slide-out");

    setTimeout(() => {
      document.querySelector(".cloud-left").classList.remove("looping");
      document.querySelector(".cloud-right").classList.remove("looping");

      state = "succeed";
      setPhase("SUCCEED");
      
      resetBtn.classList.remove("hidden");
      
    }, 800);
  }, 600);
}