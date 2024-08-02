const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const gridSizeY = 10;
const gridSizeX = 15;

// Initial snake properties
let snake = [{ x: 8, y: 5 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 300;
let gameStarted = false;

// Hide the game board on the title screen
board.style.display = "none";

// Draw the map, snake, and food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

// Draw the snake on the board
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a game element with specified tag and class
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of a game element on the grid
function setPosition(element, position) {
  element.style.gridColumnStart = position.x;
  element.style.gridRowStart = position.y;
}

// Draw the food on the board
function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

// Generate a new position for the food
function generateFood() {
  let newFoodPosition;
  while (true) {
    newFoodPosition = {
      x: Math.floor(Math.random() * gridSizeX) + 1,
      y: Math.floor(Math.random() * gridSizeY) + 1,
    };

    const isOnSnake = snake.some(
      (segment) =>
        segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
    );
    if (!isOnSnake) break;
  }
  return newFoodPosition;
}

// Move the snake in the current direction
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
  gameInterval = setInterval(gameLoop, gameSpeedDelay);
}

function gameLoop() {
  move();
  checkCollision();
  draw();
}

// Handle button presses to change the direction of the snake
function handleButtonPress(newDirection) {
  if (direction === "up" && newDirection === "down" || 
      direction === "down" && newDirection === "up" || 
      direction === "left" && newDirection === "right" || 
      direction === "right" && newDirection === "left") return;

  direction = newDirection;
}

// Handle key presses to change the direction of the snake
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

// Event listeners for restart button and direction buttons
document.getElementById("restart").addEventListener("click", startGame);
document.getElementById("up").addEventListener("click", () => handleButtonPress("up"));
document.getElementById("down").addEventListener("click", () => handleButtonPress("down"));
document.getElementById("left").addEventListener("click", () => handleButtonPress("left"));
document.getElementById("right").addEventListener("click", () => handleButtonPress("right"));
document.addEventListener("keydown", handleKeyPress);

// Increase the speed of the game
function increaseSpeed() {
  gameSpeedDelay = Math.max(gameSpeedDelay - 5, 50);
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeedDelay);
}

// Check for collisions
function checkCollision() {
  const head = snake[0];
  if (head.x < 1 || head.x > gridSizeX || head.y < 1 || head.y > gridSizeY) {
    resetGame();
  }
  if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
    resetGame();
  }
}

// Reset the game to its initial state
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 8, y: 5 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 300;
  updateScore();
}

// Stop the game and display the instruction text and logo
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "";
  logo.style.display = "";
  board.style.display = "none";
}

// Update the high score if the current score is higher
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString();
  }
}

// Update the score display
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString();
}
