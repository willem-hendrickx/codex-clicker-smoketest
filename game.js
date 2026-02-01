const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const clickArea = document.getElementById("click-area");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const messageEl = document.getElementById("message");

const TOTAL_TIME = 10;
const STORAGE_KEY = "clicker-best-score";

let score = 0;
let timeLeft = TOTAL_TIME;
let timerId = null;
let running = false;

const bestScore = Number(localStorage.getItem(STORAGE_KEY)) || 0;

bestEl.textContent = bestScore;

function updateTimeDisplay() {
  timeEl.textContent = timeLeft.toFixed(1);
}

function setMessage(text) {
  messageEl.textContent = text;
}

function resetGame() {
  score = 0;
  timeLeft = TOTAL_TIME;
  scoreEl.textContent = score;
  updateTimeDisplay();
  clickArea.disabled = true;
  running = false;
  startBtn.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  setMessage("Ready?");
}

function startGame() {
  if (running) {
    return;
  }
  score = 0;
  timeLeft = TOTAL_TIME;
  running = true;
  clickArea.disabled = false;
  scoreEl.textContent = score;
  updateTimeDisplay();
  startBtn.classList.add("hidden");
  restartBtn.classList.add("hidden");
  setMessage("Go!");

  clearInterval(timerId);
  const startTime = performance.now();

  timerId = setInterval(() => {
    const elapsed = (performance.now() - startTime) / 1000;
    timeLeft = Math.max(0, TOTAL_TIME - elapsed);
    updateTimeDisplay();
    if (timeLeft <= 0) {
      finishGame();
    }
  }, 50);
}

function finishGame() {
  if (!running) {
    return;
  }
  running = false;
  clearInterval(timerId);
  clickArea.disabled = true;
  timeLeft = 0;
  updateTimeDisplay();
  setMessage("Time!");
  restartBtn.classList.remove("hidden");

  const currentBest = Number(localStorage.getItem(STORAGE_KEY)) || 0;
  if (score > currentBest) {
    localStorage.setItem(STORAGE_KEY, String(score));
    bestEl.textContent = score;
  }
}

clickArea.addEventListener("click", () => {
  if (!running) {
    return;
  }
  score += 1;
  scoreEl.textContent = score;
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

resetGame();
