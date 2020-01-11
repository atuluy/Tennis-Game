let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let playerScore = 0;
let computerScore = 0;

const winningScore = 5;

let showWinScreen = false;

let player = document.getElementById("playerScore");
let computer = document.getElementById("computerScore");

let resultContainer = document.querySelector(".resultContainer");
let result = document.getElementById("result");

let paddle1Y = 250;
let paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;

/* ************************************************************** */

function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick(evt) {
  resultContainer.classList.remove("test");
  playerScore = 0;
  computerScore = 0;
  computer.innerText = computerScore; // update the computer score outside the canvas
  player.innerText = playerScore; // update the player score outside the canvas
  showWinScreen = false;
}

/* ************************************************************** */

window.onload = function() {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  let framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousemove", function(evt) {
    let mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - paddleHeight / 2;
  });

  canvas.addEventListener("mousedown", handleMouseClick);
};

/* ************************************************************** */

function ballReset() {
  if (playerScore >= winningScore || computerScore >= winningScore) {
    // check the winner
    if (playerScore > computerScore) {
      result.innerText = "Player Won!";
    } else {
      result.innerText = "Computer Won!";
    }
    showWinScreen = true;
  }

  computer.innerText = computerScore; // update the computer score outside the canvas
  player.innerText = playerScore; // update the player score outside the canvas

  ballSpeedX = -ballSpeedX; // change ball direction
  ballX = canvas.width / 2; // start the ball from the middle
  ballY = canvas.height / 2; // start the ball from the middle
}

/* ************************************************************** */

function computerMovement() {
  let paddle2YCenter = paddle2Y + paddleHeight / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 8;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 8;
  }
}

/* ************************************************************** */

function moveEverything() {
  if (showWinScreen) {
    return; // return leaves the function prematurely, nothing will be executed in the function if showWinScreen is true
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle1Y + paddleHeight / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      computerScore++;
      ballReset(); // ball reset must be placed after the score update
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
      ballSpeedX = -ballSpeedX;
      let deltaY = ballY - (paddle2Y + paddleHeight / 2);
      ballSpeedY = deltaY * 0.25;
    } else {
      playerScore++;
      ballReset(); // ball reset must be placed after the score update
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

/* ************************************************************** */

function drawEverything() {
  // next line blanks out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showWinScreen) {
    resultContainer.classList.add("test");
    return; // return leaves the function prematurely, nothing will be executed in the function if showWinScreen is true
  }

  drawNet();

  // this is The left paddle (Player)
  colorRect(0, paddle1Y, paddleThickness, paddleHeight, "green");

  // this is right paddle (Computer)
  colorRect(
    canvas.width - paddleThickness,
    paddle2Y,
    paddleThickness,
    paddleHeight,
    "green"
  );

  // next line draws the ball
  colorCircle(ballX, ballY, 10, "green");
}

/* ************************************************************** */

// function for creating and coloring the circle

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

// function for creating and coloring the rectangles

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "green");
  }
}
