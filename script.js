const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let bird = {
  x: 50,
  y: 150,
  width: 20,
  height: 20,
  gravity: 0.5,
  lift: -8,
  velocity: 0
};

let pipes = [];
let score = 0;

// kontrol
document.addEventListener("keydown", () => {
  bird.velocity = bird.lift;
});

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // jatuh ke bawah = game over
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
    // atas
    ctx.fillRect(pipe.x, 0, 40, pipe.top);
    // bawah
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

  // hapus pipe keluar layar
  pipes = pipes.filter(pipe => pipe.x > -40);
}

function gameOver() {
  clearInterval(game);
  alert("Game Over! Score: " + score);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  updateBird();

  drawPipes();
  updatePipes();
}

// loop game
const game = setInterval(draw, 20);

// spawn pipe tiap 2 detik
setInterval(createPipe, 2000);
