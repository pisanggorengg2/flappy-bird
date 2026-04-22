const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let birdImg = new Image();
birdImg.src = "https://i.imgur.com/QZ6XG7X.png"; // sprite burung (3 frame)

let frame = 0;

let bird;
let pipes;
let score;
let game;
let gameRunning = true;

function init() {
  bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
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

init();

// kontrol
document.addEventListener("keydown", () => {
  if (gameRunning) bird.velocity = bird.lift;
});

// gambar burung + animasi
function drawBird() {
  let spriteWidth = 34;
  let spriteHeight = 24;

  ctx.drawImage(
    birdImg,
    frame * spriteWidth, // geser frame
    0,
    spriteWidth,
    spriteHeight,
    bird.x,
    bird.y,
    bird.width,
    bird.height
  );

  frame++;
  if (frame > 2) frame = 0; // 3 frame animasi
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height) {
    gameOver();
  }
}

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

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 40, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, 40, pipe.bottom);
  });
}

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

function gameOver() {
  gameRunning = false;
  clearInterval(game);
  document.getElementById("restartBtn").style.display = "inline-block";
}

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

game = setInterval(draw, 20);
setInterval(() => {
  if (gameRunning) createPipe();
}, 2000);
