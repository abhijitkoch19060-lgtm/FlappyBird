const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;  // 16:9 ratio
canvas.height = 720;

let bird = { x: 100, y: 200, width: 40, height: 40, gravity: 0.5, lift: -8, velocity: 0 };
let pillars = [];
let score = 0;
let gameOver = false;

const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const resetBtn = document.getElementById("resetBtn");

// Sounds
const pointSound = new Audio("point.mp3");
const hitSound = new Audio("hit.mp3");

// Draw bird
function drawBird() {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.ellipse(bird.x, bird.y, bird.width/2, bird.height/2, 0, 0, Math.PI*2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(bird.x+10, bird.y-5, 6, 0, Math.PI*2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(bird.x+10, bird.y-5, 3, 0, Math.PI*2);
  ctx.fill();
}

// Draw pillars
function drawPillars() {
  ctx.fillStyle = "#8B7D6B"; // Ancient stone color
  pillars.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  });
}

// Update game
function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  drawBird();

  // Pillar movement
  pillars.forEach(p => {
    p.x -= 3;

    // Collision
    if (
      bird.x + bird.width/2 > p.x &&
      bird.x - bird.width/2 < p.x + p.width &&
      (bird.y - bird.height/2 < p.top || bird.y + bird.height/2 > canvas.height - p.bottom)
    ) {
      endGame();
    }

    // Passed pillar
    if (!p.passed && bird.x > p.x + p.width) {
      score++;
      p.passed = true;
      pointSound.play();
      scoreElement.textContent = "Score: " + score;
      if (score >= 999) endGame();
    }
  });

  // Remove old pillars
  pillars = pillars.filter(p => p.x + p.width > 0);

  // Add new pillars
  if (pillars.length === 0 || pillars[pillars.length-1].x < canvas.width - 300) {
    let top = Math.random() * (canvas.height/2);
    let bottom = canvas.height/2 - top;
    pillars.push({ x: canvas.width, width: 60, top: top, bottom: bottom, passed: false });
  }

  drawPillars();

  // Bird hits ground
  if (bird.y + bird.height/2 >= canvas.height) {
    endGame();
  }

  requestAnimationFrame(update);
}

// End game
function endGame() {
  hitSound.play();
  gameOver = true;
  gameOverScreen.style.display = "block";
}

// Reset game
resetBtn.addEventListener("click", () => {
  bird.y = 200;
  bird.velocity = 0;
  pillars = [];
  score = 0;
  scoreElement.textContent = "Score: 0";
  gameOver = false;
  gameOverScreen.style.display = "none";
  update();
});

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bird.velocity = bird.lift;
  }
});

// Start game
update();
