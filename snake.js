const board = document.getElementById("game-board");

const gridSizeY = 10;
const gridSizeX = 15;
const highScoreText = document.getElementById('highScore');

let snake = [{ x: 8, y: 5 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById('score');

board.style.display = "none";

document.getElementById("restart").addEventListener("click", startGame);
document.getElementById("up").addEventListener("click", () => handleButtonPress("up"));
document.getElementById("down").addEventListener("click", () => handleButtonPress("down"));
document.getElementById("left").addEventListener("click", () => handleButtonPress("left"));
document.getElementById("right").addEventListener("click", () => handleButtonPress("right"));
document.addEventListener("keydown", handleKeyPress);

// Draw map, snake, and food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumnStart = position.x;
  element.style.gridRowStart = position.y;
}

// Draw food
function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSizeX) + 1;
  const y = Math.floor(Math.random() * gridSizeY) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;
      break;
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
  }
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = "none";
  logo.style.display = "none";
  board.style.display = "";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleButtonPress(newDirection) {
  switch (newDirection) {
    case "up":
      if (direction !== "down") direction = "up";
      break;
    case "down":
      if (direction !== "up") direction = "down";
      break;
    case "left":
      if (direction !== "right") direction = "left";
      break;
    case "right":
      if (direction !== "left") direction = "right";
      break;
  }
}

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      handleButtonPress("up");
      break;
    case "ArrowDown":
      handleButtonPress("down");
      break;
    case "ArrowLeft":
      handleButtonPress("left");
      break;
    case "ArrowRight":
      handleButtonPress("right");
      break;
  }
}

function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }

  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function checkCollision() {
  const head = snake[0];

  // Check for wall collisions
  if (head.x < 1 || head.x > gridSizeX || head.y < 1 || head.y > gridSizeY) {
    resetGame();
  }

  // Check for self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 8, y: 5 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = '';
  logo.style.display = '';
  board.style.display = 'none';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString();
  }
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString();
}
