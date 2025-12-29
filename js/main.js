/**
 * main.js
 * Rock Paper Scissors Pose Game - Main Controller
 * 
 * Integrates ImageEngine, GameEngine, and Stabilizer
 * Manages UI updates and game flow
 */

// Global variables
let imageEngine;
let gameEngine;
let stabilizer;
let ctx;
let labelContainer;

// UI Elements
let gamePhaseEl;
let playerChoiceEl;
let computerChoiceEl;
let resultDisplayEl;
let winsEl;
let drawsEl;
let lossesEl;

// Game state
let currentDetectedPose = null;

/**
 * Initialize the application
 */
async function init() {
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");

  startBtn.disabled = true;

  try {
    // Get UI elements
    gamePhaseEl = document.getElementById("game-phase");
    playerChoiceEl = document.getElementById("player-choice");
    computerChoiceEl = document.getElementById("computer-choice");
    resultDisplayEl = document.getElementById("result-display");
    winsEl = document.getElementById("wins");
    drawsEl = document.getElementById("draws");
    lossesEl = document.getElementById("losses");

    // 1. Initialize ImageEngine
    imageEngine = new ImageEngine("./RPS_tensorflow.js/");
    const { maxPredictions, webcam } = await imageEngine.init({
      size: 300,
      flip: true
    });

    // 2. Initialize Stabilizer
    stabilizer = new PredictionStabilizer({
      threshold: 0.7,
      smoothingFrames: 3
    });

    // 3. Initialize GameEngine
    gameEngine = new GameEngine();

    // Set up game callbacks
    gameEngine.setPhaseChangeCallback(handlePhaseChange);
    gameEngine.setScoreChangeCallback(handleScoreChange);
    gameEngine.setResultCallback(handleResult);

    // 4. Set up canvas
    const canvas = document.getElementById("canvas");
    canvas.width = 300;
    canvas.height = 300;
    ctx = canvas.getContext("2d");

    // 5. Set up label container (for debugging)
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }

    // 6. Set ImageEngine callbacks
    imageEngine.setPredictionCallback(handlePrediction);
    imageEngine.setDrawCallback(drawWebcam);

    // 7. Start ImageEngine
    imageEngine.start();

    // 8. Start Game
    gameEngine.start();

    stopBtn.disabled = false;
  } catch (error) {
    console.error("초기화 중 오류 발생:", error);
    alert("초기화에 실패했습니다. 콘솔을 확인하세요.");
    startBtn.disabled = false;
  }
}

/**
 * Stop the application
 */
function stop() {
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");

  if (imageEngine) {
    imageEngine.stop();
  }

  if (gameEngine) {
    gameEngine.stop();
  }

  if (stabilizer) {
    stabilizer.reset();
  }

  // Clear UI
  gamePhaseEl.innerHTML = "";
  playerChoiceEl.innerHTML = "";
  computerChoiceEl.innerHTML = "?";
  resultDisplayEl.innerHTML = "";
  resultDisplayEl.className = "";

  startBtn.disabled = false;
  stopBtn.disabled = true;
}

/**
 * Handle prediction from ImageEngine
 */
function handlePrediction(predictions) {
  // 1. Stabilize predictions
  const stabilized = stabilizer.stabilize(predictions);

  // 2. Update label container (debug)
  for (let i = 0; i < predictions.length; i++) {
    const classPrediction =
      predictions[i].className + ": " + predictions[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
  }

  // 3. Update max prediction display
  const maxPredictionDiv = document.getElementById("max-prediction");
  if (stabilized.className) {
    maxPredictionDiv.innerHTML = stabilized.className;
    currentDetectedPose = stabilized.className;
  } else {
    maxPredictionDiv.innerHTML = "감지 중...";
    currentDetectedPose = null;
  }

  // 4. Capture player choice during DRAW phase
  if (gameEngine && gameEngine.currentPhase === 'draw' && currentDetectedPose) {
    // Capture the webcam image
    const canvas = document.getElementById("canvas");
    const imageData = canvas.toDataURL('image/png');
    gameEngine.setPlayerChoice(currentDetectedPose, imageData);
  }
}

/**
 * Draw webcam on canvas
 */
function drawWebcam() {
  if (imageEngine.webcam && imageEngine.webcam.canvas) {
    ctx.drawImage(imageEngine.webcam.canvas, 0, 0);
  }
}

/**
 * Handle game phase changes
 */
function handlePhaseChange(phase, message) {
  gamePhaseEl.innerHTML = message;

  // Clear previous displays when starting new round
  if (phase === 'instruction') {
    playerChoiceEl.innerHTML = "";
    computerChoiceEl.innerHTML = "?";
    resultDisplayEl.innerHTML = "";
    resultDisplayEl.className = "";
  }
}

/**
 * Handle score changes
 */
function handleScoreChange(wins, draws, losses) {
  winsEl.textContent = wins;
  drawsEl.textContent = draws;
  lossesEl.textContent = losses;
}

/**
 * Handle game result
 */
function handleResult(result, playerChoice, computerChoice) {
  // Show player choice
  const playerEmoji = gameEngine.getEmoji(playerChoice || '❓');
  playerChoiceEl.innerHTML = playerEmoji;

  // Show computer choice
  const computerEmoji = gameEngine.getEmoji(computerChoice);
  computerChoiceEl.innerHTML = computerEmoji;

  // Show result message
  let resultMessage = "";
  let resultClass = "";

  if (!playerChoice) {
    resultMessage = "포즈를 감지하지 못했습니다!";
    resultClass = "draw";
  } else if (result === 'win') {
    resultMessage = "🎉 승리! 🎉";
    resultClass = "win";
  } else if (result === 'lose') {
    resultMessage = "😢 패배... 😢";
    resultClass = "lose";
  } else {
    resultMessage = "무승부";
    resultClass = "draw";
  }

  resultDisplayEl.innerHTML = resultMessage;
  resultDisplayEl.className = resultClass;

  // Clear game phase message
  gamePhaseEl.innerHTML = "";
}
