const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let bird;
let pipes;
let score;
let game;
let gameRunning;

function init() {
  bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.5,
    lift: -8,
    velocity: 0
  };

  pipes = [];
  score = 0;
  gameRunning = true;

  document.getElementById("score").textContent = score;
  document.getElementById("restartBtn").style.display = "none";
}

// kontrol (lompat)
document.addEventListener("keydown", (e) => {
  if (gameRunning && e.code === "Space") {
    bird.velocity = bird.lift;
  }
});

// gambar burung (kotak)
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

// update posisi burung
function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // jatuh = game over
  if (bird.y + bird.height > canvas.height) {
    gameOver();
  }
}

// bikin pipa
function createPipe() {
  let topHeight = Math.random() * 300;
  let gap = 120;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap,
    passed: false
  });
}

// gambar pipa
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 40, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 40, pipe.bottom);
  });
}

// update pipa
function updatePipes() {
  pipes.forEach(pipe => {
    pipe.x -= 2;

    // collision
    if (
      bird.x < pipe.x + 40 &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      gameOver();
    }

    // score
    if (!pipe.passed && pipe.x < bird.x) {
      pipe.passed = true;
      score++;
      document.getElementById("score").textContent = score;
    }
  });

  pipes = pipes.filter(pipe => pipe.x > -40);
}

// game over
function gameOver() {
  gameRunning = false;
  clearInterval(game);
  document.getElementById("restartBtn").style.display = "inline-block";
}

// restart
function restartGame() {
  clearInterval(game);
  init();
  game = setInterval(draw, 20);
}

// loop
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  updateBird();

  drawPipes();
  updatePipes();
}

// start awal
init();
game = setInterval(draw, 20);

// spawn pipa
setInterval(() => {
  if (gameRunning) createPipe();
}, 2000);
