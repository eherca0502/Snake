const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }];
let direction;
let food = spawnFood();
let score = 0;
let level = 1;
let speed = 200;


const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const levelUpSound = new Audio("sounds/levelup.mp3");

document.addEventListener("keydown", setDirection);

function setDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#00ffcc" : "#00ffaa";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00ffcc";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.shadowBlur = 0;
  }


  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
  ctx.fill();


  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;


  if (snakeX === food.x && snakeY === food.y) {
    score++;
    eatSound.play();
    food = spawnFood();

    if (score % 5 === 0) {
      level++;
      speed = Math.max(60, speed - 20);
      clearInterval(game);
      game = setInterval(draw, speed);
      levelUpSound.play();
    }

    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };


  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    gameOverSound.play();
    alert("💀 Game Over! Tu puntuación: " + score);
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  return array.some(segment => segment.x === head.x && segment.y === head.y);
}

let game = setInterval(draw, speed);
