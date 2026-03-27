const phaseText = document.getElementById('phaseText');
const actionBtn = document.getElementById('actionBtn');
const bugEls = [document.getElementById('bug1'), document.getElementById('bug2'), document.getElementById('bug3')];
const hitEl = document.getElementById('hit');
const explodeEl = document.getElementById('explode');
const screen = document.getElementById('screen');

let state = 'launch';


function setPhase(text) {
  phaseText.style.opacity = '0';
  setTimeout(() => {
    phaseText.textContent = text;
    phaseText.style.opacity = '1';
  }, 150);
}


actionBtn.addEventListener('click', () => {
  if (state !== 'launch') return;
  state = 'debug';

  // Disable button so it can't be clicked again
  actionBtn.disabled = true;

  // Phase text → DEBUG
  setPhase('DEBUG');


  fireHit();
});


function fireHit() {
  const screenH = screen.offsetHeight;

  const startBottom = screenH * 0.12;
  const endBottom = screenH * 0.80;

  hitEl.style.bottom = startBottom + 'px';
  hitEl.style.removeProperty('top');
  hitEl.style.position = 'absolute';
  hitEl.style.left = '50%';
  hitEl.style.transform = 'translateX(-50%)';
  hitEl.style.transition = 'none';
  hitEl.classList.remove('hidden');


  hitEl.getBoundingClientRect();

  const DURATION = 1500;
  hitEl.style.transition = `bottom ${DURATION}ms linear`;
  hitEl.style.bottom = endBottom + 'px';

  setTimeout(() => {

    hitEl.classList.add('hidden');
    showExplode();
  }, DURATION);
}


function showExplode() {

  bugEls.forEach(b => b.classList.add('hidden'));

  explodeEl.classList.remove('hidden');
  explodeEl.style.animation = 'none';
  explodeEl.getBoundingClientRect();
  explodeEl.style.animation = '';

  setTimeout(() => {
    state = 'succeed';
    setPhase('SUCCEED');
    explodeEl.style.transition = 'opacity 0.5s';
    explodeEl.style.opacity = '0';
    setTimeout(() => {
      explodeEl.classList.add('hidden');
      explodeEl.style.opacity = '';
      explodeEl.style.transition = '';
    }, 520);
  }, 600);
}
