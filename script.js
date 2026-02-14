// ============================================
// Neon Valentine — Full Interaction Engine
// ============================================

// ===== SOUND HELPER =====
function playSound(id, volume = 0.5) {
  const audio = document.getElementById(id);
  if (audio) {
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  }
}

// ===== SCREEN NAVIGATION =====
function goScreen(n) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen' + n);
  if (target) {
    target.classList.add('active');
    if (n === 2) runChecklist();
    if (n === 5) revealTimeline();
    if (n === 6) setupNoButton();
    if (n === 7) celebrate();
  }
}

// ============================================
// SCREEN 1: LOADING FEELINGS PROGRESS BAR
// ============================================
(function setupLoader() {
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('loadText');
  const error = document.getElementById('errorText');
  const btn = document.getElementById('continueBtn');
  if (!bar || !text || !btn) return;

  let progress = 0;
  let attempt = 1;

  function setProgress(val) {
    progress = val;
    bar.style.width = Math.min(val, 100) + '%';
    text.textContent = Math.floor(Math.min(val, 100)) + '%';

    if (val > 100) {
      bar.classList.add('overloaded');
      text.style.color = '#ff4444';
    } else {
      bar.classList.remove('overloaded');
      text.style.color = '';
    }
  }

  function animateTo(target, cb) {
    const step = () => {
      if (progress < target) {
        progress += 0.6;
        if (progress > target) progress = target;
        setProgress(progress);
        requestAnimationFrame(step);
      } else if (cb) cb();
    };
    requestAnimationFrame(step);
  }

  function rollbackTo(target, cb) {
    const step = () => {
      if (progress > target) {
        progress -= 1.2;
        if (progress < target) progress = target;
        setProgress(progress);
        requestAnimationFrame(step);
      } else if (cb) cb();
    };
    requestAnimationFrame(step);
  }

  function handleOverload() {
    error.classList.add('show');
    const title = document.querySelector('#screen1 h2');
    if (title) title.classList.add('glitch');

    setTimeout(() => {
      if (title) title.classList.remove('glitch');
      rollbackTo(0, () => {
        error.classList.remove('show');
        attempt = 2;
        setTimeout(startLoading, 400);
      });
    }, 1600);
  }

  function startLoading() {
    if (attempt === 1) progress = 0;

    const interval = setInterval(() => {
      const next = progress + (Math.random() * 6 + 3);

      if (attempt === 1 && progress < 96) {
        animateTo(Math.min(next, 96));
        return;
      }
      if (attempt === 1 && progress >= 96) {
        clearInterval(interval);
        const overload = Math.floor(Math.random() * 8) + 102;
        setTimeout(() => animateTo(overload, handleOverload), 500);
        return;
      }
      if (attempt === 2 && next >= 100) {
        clearInterval(interval);
        animateTo(100, () => {
          btn.disabled = false;
          playSound('neonOnSound', 0.4);
        });
        return;
      }
      animateTo(next);
    }, Math.random() * 200 + 150);
  }

  setTimeout(startLoading, 600);

  btn.addEventListener('click', () => goScreen(2));
})();

// ============================================
// SCREEN 2: ANIMATED CHECKLIST
// ============================================
let checklistDone = false;
function runChecklist() {
  if (checklistDone) return;
  checklistDone = true;

  const items = document.querySelectorAll('#checklist li');
  const compat = document.getElementById('compatibility');
  const btn = document.getElementById('nextBtn2');
  let delay = 400;

  items.forEach((li) => {
    setTimeout(() => {
      li.classList.add('revealed');
      setTimeout(() => {
        li.classList.add('checked');
        playSound('checkSound', 0.5);
      }, 300);
    }, delay);
    delay += 700;
  });

  setTimeout(() => {
    if (compat) compat.classList.add('show');
    playSound('neonOnSound', 0.3);
    setTimeout(() => {
      if (btn) btn.disabled = false;
    }, 500);
  }, delay + 200);
}

// ============================================
// SCREEN 4: MAZE GAME
// ============================================
const MAZE_COLS = 10, MAZE_ROWS = 10;
const REQUIRED_COLLECTIBLES = 5;
let gameActive = false, mazePlayer = { x: 1, y: 1 }, mazeTarget = { x: 8, y: 8 };
let collectibles = [], mazeSteps = 0, collectedCount = 0, timeElapsed = 0;
let maze = [], cellSize = 0, mazeCanvas, mazeCtx, gameInterval, hasWon = false;
let currentMazeFone = null;

function startMazeGame() {
  goScreen(4);
  setTimeout(() => initMazeGame(), 50);
}

function initMazeGame() {
  mazeCanvas = document.getElementById('mazeCanvas');
  mazeCtx = mazeCanvas.getContext('2d');

  mazeCanvas.width = 330;
  mazeCanvas.height = 330;
  cellSize = mazeCanvas.width / MAZE_COLS;

  const container = document.getElementById('gameContainer');
  container.style.width = '340px';
  container.style.height = '340px';
  container.style.padding = '5px';

  setupTouchControls();

  gameActive = false;
  mazeSteps = 0;
  collectedCount = 0;
  timeElapsed = 0;
  hasWon = false;

  document.getElementById('steps').textContent = '0';
  document.getElementById('collected').textContent = '0/' + REQUIRED_COLLECTIBLES;
  document.getElementById('time').textContent = '0';

  document.getElementById('mazeControlsContainer').style.opacity = '1';
  document.getElementById('mazeCompletionMessage').classList.remove('show');
  document.getElementById('nextMazeBtn').disabled = true;

  generateMaze();
  drawMaze();
  drawGameElements();

  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateTimer, 1000);
  gameActive = true;

  if (window.innerWidth <= 768) showMobileHint();

  playMazeFone();
}

function restartMazeGame() {
  initMazeGame();
}

function generateMaze() {
  const rows = MAZE_ROWS, cols = MAZE_COLS;
  maze = Array(rows).fill().map(() => Array(cols).fill().map(() => ({
    top: true, right: true, bottom: true, left: true, visited: false
  })));

  const stack = [];
  let current = { x: 0, y: 0 };
  maze[0][0].visited = true;

  while (true) {
    const neighbors = [];

    if (current.y > 0 && !maze[current.y - 1][current.x].visited)
      neighbors.push({ x: current.x, y: current.y - 1, dir: 'top' });
    if (current.x < cols - 1 && !maze[current.y][current.x + 1].visited)
      neighbors.push({ x: current.x + 1, y: current.y, dir: 'right' });
    if (current.y < rows - 1 && !maze[current.y + 1][current.x].visited)
      neighbors.push({ x: current.x, y: current.y + 1, dir: 'bottom' });
    if (current.x > 0 && !maze[current.y][current.x - 1].visited)
      neighbors.push({ x: current.x - 1, y: current.y, dir: 'left' });

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      stack.push(current);

      if (next.dir === 'top') { maze[current.y][current.x].top = false; maze[next.y][next.x].bottom = false; }
      else if (next.dir === 'right') { maze[current.y][current.x].right = false; maze[next.y][next.x].left = false; }
      else if (next.dir === 'bottom') { maze[current.y][current.x].bottom = false; maze[next.y][next.x].top = false; }
      else if (next.dir === 'left') { maze[current.y][current.x].left = false; maze[next.y][next.x].right = false; }

      maze[next.y][next.x].visited = true;
      current = { x: next.x, y: next.y };
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }

  mazePlayer = { x: 1, y: 1 };
  mazeTarget = { x: cols - 2, y: rows - 2 };

  collectibles = [];
  const totalCollectibles = 12;
  for (let i = 0; i < totalCollectibles; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * cols);
      y = Math.floor(Math.random() * rows);
    } while (
      (x === mazePlayer.x && y === mazePlayer.y) ||
      (x === mazeTarget.x && y === mazeTarget.y) ||
      collectibles.some(c => c.x === x && c.y === y)
    );
    collectibles.push({
      x, y,
      collected: false,
      emoji: ['💖', '💕', '💗', '💓', '💞', '💝', '💘', '💟'][i % 8],
      id: `collectible_${i}`
    });
  }
}

function drawMaze() {
  const rows = MAZE_ROWS, cols = MAZE_COLS;
  mazeCtx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  mazeCtx.fillStyle = '#0a0a12';
  mazeCtx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);

  mazeCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  mazeCtx.lineWidth = 2;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = maze[y][x];
      const px = x * cellSize;
      const py = y * cellSize;

      if (cell.top) { mazeCtx.beginPath(); mazeCtx.moveTo(px, py); mazeCtx.lineTo(px + cellSize, py); mazeCtx.stroke(); }
      if (cell.right) { mazeCtx.beginPath(); mazeCtx.moveTo(px + cellSize, py); mazeCtx.lineTo(px + cellSize, py + cellSize); mazeCtx.stroke(); }
      if (cell.bottom) { mazeCtx.beginPath(); mazeCtx.moveTo(px, py + cellSize); mazeCtx.lineTo(px + cellSize, py + cellSize); mazeCtx.stroke(); }
      if (cell.left) { mazeCtx.beginPath(); mazeCtx.moveTo(px, py); mazeCtx.lineTo(px, py + cellSize); mazeCtx.stroke(); }
    }
  }

  mazeCtx.fillStyle = 'rgba(255, 45, 149, 0.03)';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      mazeCtx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    }
  }
}

function createElement(tag, className, text, left, top) {
  const el = document.createElement(tag);
  el.className = className;
  el.textContent = text;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  return el;
}

function drawGameElements() {
  const gameElements = document.getElementById('gameElements');
  gameElements.innerHTML = '';
  const offset = 5, half = 16.5;

  const playerEl = createElement('div', 'player', '💖',
    offset + mazePlayer.x * cellSize + half - 15.5,
    offset + mazePlayer.y * cellSize + half - 15.5);
  gameElements.appendChild(playerEl);

  const targetEl = createElement('div', 'target', '🎯',
    offset + mazeTarget.x * cellSize + half - 14,
    offset + mazeTarget.y * cellSize + half - 14);
  gameElements.appendChild(targetEl);

  collectibles.forEach((item, i) => {
    if (!item.collected) {
      const el = createElement('div', 'collectible', item.emoji,
        offset + item.x * cellSize + half - 13.5,
        offset + item.y * cellSize + half - 13.5);
      el.setAttribute('data-id', item.id);
      el.style.animationDelay = (i * 0.2) + 's';
      gameElements.appendChild(el);
    }
  });
}

function setupTouchControls() {
  if (!mazeCanvas) mazeCanvas = document.getElementById('mazeCanvas');
  if (!mazeCanvas) return;

  ['touchstart', 'touchend'].forEach(event => {
    mazeCanvas.removeEventListener(event, mazeCanvas[`_${event}`]);
  });

  let touchStartX = 0, touchStartY = 0;

  mazeCanvas._touchstart = (e) => {
    if (!gameActive) return;
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  };

  mazeCanvas._touchend = (e) => {
    if (!gameActive) return;
    e.preventDefault();
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 25) movePlayer(1, 0);
      else if (deltaX < -25) movePlayer(-1, 0);
    } else {
      if (deltaY > 25) movePlayer(0, 1);
      else if (deltaY < -25) movePlayer(0, -1);
    }
  };

  mazeCanvas.addEventListener('touchstart', mazeCanvas._touchstart, { passive: false });
  mazeCanvas.addEventListener('touchend', mazeCanvas._touchend, { passive: false });
}

function canMove(dx, dy) {
  const cell = maze[mazePlayer.y][mazePlayer.x];
  if (dx === 1) return !cell.right;
  if (dx === -1) return !cell.left;
  if (dy === 1) return !cell.bottom;
  if (dy === -1) return !cell.top;
  return false;
}

function checkCollectibles() {
  let collectedThisMove = false;
  collectibles.forEach(item => {
    if (!item.collected && item.x === mazePlayer.x && item.y === mazePlayer.y) {
      item.collected = true;
      collectedCount++;
      collectedThisMove = true;
      document.getElementById('collected').textContent = collectedCount + '/' + REQUIRED_COLLECTIBLES;
      if (navigator.vibrate) navigator.vibrate([40, 40, 80]);
      const el = document.querySelector(`[data-id="${item.id}"]`);
      if (el) el.remove();
    }
  });
  if (collectedThisMove) playMazeCatch();
}

function movePlayer(dx, dy) {
  if (!gameActive) return;

  const newX = mazePlayer.x + dx;
  const newY = mazePlayer.y + dy;

  if (newX < 0 || newX >= MAZE_COLS || newY < 0 || newY >= MAZE_ROWS) {
    if (navigator.vibrate) navigator.vibrate(80);
    return;
  }

  if (!canMove(dx, dy)) {
    if (navigator.vibrate) navigator.vibrate(80);
    return;
  }

  createTrail(mazePlayer.x, mazePlayer.y);

  mazePlayer.x = newX;
  mazePlayer.y = newY;
  mazeSteps++;
  document.getElementById('steps').textContent = mazeSteps;

  if (navigator.vibrate) navigator.vibrate(20);

  checkCollectibles();
  updatePlayerPosition();

  if (mazePlayer.x === mazeTarget.x && mazePlayer.y === mazeTarget.y) {
    if (collectedCount >= REQUIRED_COLLECTIBLES) {
      completeMazeGame();
    } else {
      showNeedMoreCollectibles();
    }
  }
}

function updatePlayerPosition() {
  const playerElement = document.querySelector('.player');
  if (playerElement) {
    const offset = 5;
    playerElement.style.left = (offset + mazePlayer.x * cellSize + 16.5 - 15.5) + 'px';
    playerElement.style.top = (offset + mazePlayer.y * cellSize + 16.5 - 15.5) + 'px';
  }
}

function showNeedMoreCollectibles() {
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

  const message = document.createElement('div');
  message.style.cssText = `
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.85); color: var(--neon-pink);
    padding: 12px 20px; border-radius: 15px; border: 2px solid var(--neon-pink);
    font-weight: bold; text-align: center; z-index: 1000;
    animation: fadeInOut 1.5s ease forwards; pointer-events: none;
    box-shadow: 0 0 20px rgba(255, 45, 149, 0.5);
  `;

  const needed = REQUIRED_COLLECTIBLES - collectedCount;
  message.innerHTML = `Collect ${needed} more hearts! 💖`;

  document.getElementById('gameContainer').appendChild(message);
  setTimeout(() => { if (message.parentNode) message.remove(); }, 1500);
}

function createTrail(x, y) {
  const trail = document.createElement('div');
  trail.className = 'trail';
  const offset = 5;
  trail.style.left = (offset + x * cellSize + 16.5 - 3) + 'px';
  trail.style.top = (offset + y * cellSize + 16.5 - 3) + 'px';
  document.getElementById('gameElements').appendChild(trail);
  setTimeout(() => { if (trail.parentNode) trail.remove(); }, 1500);
}

function updateTimer() {
  if (!gameActive) return;
  timeElapsed++;
  document.getElementById('time').textContent = timeElapsed;
}

function showMobileHint() {
  const hint = document.createElement('div');
  hint.className = 'mobile-hint';
  hint.innerHTML = `
    <div class="hint-row">
      <span class="hint-icon">👆</span>
      <span>Swipe to move</span>
    </div>
  `;
  document.querySelector('.game-container').appendChild(hint);
  setTimeout(() => hint.remove(), 3000);
}

function completeMazeGame() {
  gameActive = false;
  hasWon = true;
  clearInterval(gameInterval);

  stopAllMazeSounds();
  playMazeFinal();

  if (navigator.vibrate) navigator.vibrate([80, 40, 80, 40, 150]);

  const controlsContainer = document.getElementById('mazeControlsContainer');
  const completionMsg = document.getElementById('mazeCompletionMessage');
  const nextBtn = document.getElementById('nextMazeBtn');

  const totalCollectibles = collectibles.length;
  const isPerfect = collectedCount >= totalCollectibles;

  completionMsg.innerHTML = isPerfect ? `
    <h3 style="color: var(--neon-pink); text-shadow: 0 0 12px var(--neon-pink);">
      💖 PERFECT! 💖
    </h3>
    <p style="color: var(--neon-blue); text-shadow: 0 0 8px var(--neon-blue); font-size: 1.1em;">
      You collected ALL the love!
    </p>
  ` : `
    <h3 style="color: var(--neon-pink); text-shadow: 0 0 12px var(--neon-pink);">
      You found your way 🏆
    </h3>
    <p>Through every wall, you made it to my heart 💖</p>
  `;

  controlsContainer.style.opacity = '0';
  setTimeout(() => completionMsg.classList.add('show'), 300);

  nextBtn.disabled = false;
  createFireworks();
}

function createFireworks() {
  const container = document.querySelector('.game-container');
  const offset = 5;

  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const firework = document.createElement('div');
      const xPos = offset + Math.random() * (mazeCanvas.width - 30) + 15;
      const yPos = offset + Math.random() * (mazeCanvas.height - 30) + 15;

      firework.style.cssText = `
        position: absolute; width: 8px; height: 8px; border-radius: 50%;
        background: ${Math.random() > 0.5 ? 'var(--neon-pink)' : 'var(--neon-blue)'};
        left: ${xPos}px; top: ${yPos}px;
        animation: explode 0.8s ease-out forwards;
        pointer-events: none; z-index: 1000;
      `;

      container.appendChild(firework);
      setTimeout(() => firework.remove(), 800);
    }, i * 80);
  }
}

// ===== MAZE SOUND FUNCTIONS =====
function playMazeFone() {
  stopAllMazeSounds();
  const mazeFone = document.getElementById('mazeFone');
  if (mazeFone) {
    mazeFone.volume = 0.3;
    mazeFone.loop = true;
    mazeFone.play().catch(() => {});
    currentMazeFone = mazeFone;
  }
}

function playMazeCatch() {
  const mazeCatch = document.getElementById('mazeCatch');
  if (mazeCatch) {
    mazeCatch.currentTime = 0;
    mazeCatch.volume = 0.5;
    mazeCatch.play().catch(() => {});
  }
}

function playMazeFinal() {
  const mazeFinal = document.getElementById('mazeFinal');
  if (mazeFinal) {
    mazeFinal.currentTime = 0;
    mazeFinal.volume = 0.5;
    mazeFinal.play().catch(() => {});
  }
}

function stopAllMazeSounds() {
  if (currentMazeFone) {
    currentMazeFone.pause();
    currentMazeFone.currentTime = 0;
    currentMazeFone = null;
  }
}

// ============================================
// SCREEN 5: TIMELINE CARD REVEAL
// ============================================
let timelineDone = false;
function revealTimeline() {
  if (timelineDone) return;
  timelineDone = true;

  // Stop maze sounds when leaving maze
  stopAllMazeSounds();

  const cards = document.querySelectorAll('#timelineCards .tcard');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('revealed');
    }, 300 + i * 250);
  });
}

// ============================================
// SCREEN 6: RUNNING "NO" BUTTON
// ============================================
const noMessages = [
  "Nope, try again 😏",
  "That's not an option 💅",
  "You sure about that? 🤨",
  "Wrong answer bestie 😤",
  "My heart said no to your no 💔",
  "The button literally ran away from you 🏃‍♂️",
  "I'm not giving up that easy 😌",
  "Error 404: 'No' not found 🚫",
  "Nice try though 😘",
  "You're stuck with me 🫶"
];
let noCount = 0;
let noSetupDone = false;

function setupNoButton() {
  if (noSetupDone) return;
  noSetupDone = true;

  const noBtn = document.getElementById('noBtn');
  const noArea = document.getElementById('noArea');
  const msgContainer = document.getElementById('noMessages');
  if (!noBtn || !noArea) return;

  noBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (msgContainer && noCount < noMessages.length) {
      const msg = document.createElement('div');
      msg.className = 'no-msg';
      msg.textContent = noMessages[noCount];
      msgContainer.prepend(msg);
      requestAnimationFrame(() => msg.classList.add('show'));
      setTimeout(() => {
        msg.classList.remove('show');
        setTimeout(() => msg.remove(), 400);
      }, 2500);
    }

    noCount++;

    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight * 0.6;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    noBtn.style.position = 'fixed';
    noBtn.style.left = newX + 'px';
    noBtn.style.top = newY + 'px';
    noBtn.style.transform = 'none';

    const scale = Math.max(0.4, 1 - noCount * 0.08);
    noBtn.style.fontSize = (15 * scale) + 'px';
    noBtn.style.padding = `${12 * scale}px ${22 * scale}px`;

    if (noCount >= noMessages.length) {
      setTimeout(() => {
        noBtn.style.opacity = '0';
        setTimeout(() => noBtn.remove(), 300);
      }, 500);
    }
  });
}

// ============================================
// SCREEN 7: CELEBRATION
// ============================================
function celebrate() {
  // Stop any remaining maze sounds
  stopAllMazeSounds();

  const music = document.getElementById('whatIsLove');
  if (music) {
    music.volume = 0.4;
    music.play().catch(() => {});
  }

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  launchHeartExplosion(cx, cy);

  const hugBtn = document.getElementById('hugBtn');
  if (hugBtn) {
    hugBtn.addEventListener('click', () => {
      const rect = hugBtn.getBoundingClientRect();
      const hx = rect.left + rect.width / 2;
      const hy = rect.top + rect.height / 2;
      launchHeartExplosion(hx, hy);
      hugBtn.textContent = '🤗💕';
      setTimeout(() => {
        hugBtn.textContent = 'Send another hug 🤗';
      }, 1500);
    });
  }
}

// ===== HEART EXPLOSION =====
function launchHeartExplosion(cx, cy) {
  const hearts = ['❤️', '🧡', '💛', '💚', '💙', '💜', '♥', '💕', '💗', '💖'];

  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'heart-particle';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    el.style.fontSize = (16 + Math.random() * 20) + 'px';

    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 200;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    el.style.setProperty('--tx', tx + 'px');
    el.style.setProperty('--ty', ty + 'px');
    el.style.setProperty('--r1', (Math.random() * 360) + 'deg');
    el.style.setProperty('--r2', (Math.random() * 720) + 'deg');
    el.style.setProperty('--r3', (Math.random() * 1080) + 'deg');
    el.style.animationDelay = (Math.random() * 0.2) + 's';

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }
}
