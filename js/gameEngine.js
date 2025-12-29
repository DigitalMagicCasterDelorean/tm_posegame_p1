/**
 * gameEngine.js
 * Rock Paper Scissors game logic
 * 
 * Manages game flow: GET READY → DRAW → Show choices → Determine winner
 */

class GameEngine {
  constructor() {
    this.wins = 0;
    this.draws = 0;
    this.losses = 0;
    this.isGameActive = false;
    this.currentPhase = null; // 'instruction', 'ready', 'draw', 'result'
    this.playerChoice = null;
    this.computerChoice = null;
    this.capturedImage = null;

    // Callbacks
    this.onPhaseChange = null;
    this.onScoreChange = null;
    this.onResult = null;

    // Game constants
    this.CHOICES = ['가위', '바위', '보자기'];
    this.CHOICE_EMOJIS = {
      '가위': '✌️',
      '바위': '✊',
      '보자기': '✋'
    };
  }

  /**
   * Start the game
   */
  start() {
    this.isGameActive = true;
    this.wins = 0;
    this.draws = 0;
    this.losses = 0;

    // Update score display
    if (this.onScoreChange) {
      this.onScoreChange(this.wins, this.draws, this.losses);
    }

    // Start first round
    this.startRound();
  }

  /**
   * Stop the game
   */
  stop() {
    this.isGameActive = false;
    this.currentPhase = null;
  }

  /**
   * Start a new round
   */
  startRound() {
    if (!this.isGameActive) return;

    this.playerChoice = null;
    this.computerChoice = null;
    this.capturedImage = null;

    // Phase 0: Show instruction
    this.setPhase('instruction');
    setTimeout(() => {
      if (!this.isGameActive) return;
      // Phase 1: Start countdown (3, 2, 1)
      this.startCountdown();
    }, 2000); // 2 seconds for instruction
  }

  /**
   * Start countdown (3, 2, 1)
   */
  startCountdown() {
    let count = 3;
    this.setPhase('ready', count);

    const countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        this.setPhase('ready', count);
      } else {
        clearInterval(countdownInterval);
        if (this.isGameActive) {
          // Phase 2: DRAW
          this.setPhase('draw');
        }
      }
    }, 1000); // 1 second intervals
  }

  /**
   * Set current game phase
   */
  setPhase(phase, countdown) {
    this.currentPhase = phase;

    if (this.onPhaseChange) {
      let message = '';

      if (phase === 'instruction') {
        message = '가위, 바위, 보 중 하나를 골라<br>"DRAW!!" 에 내세요!<br><small style="font-size: 0.6em;">💡 얼굴이 카메라에 잡히지 않게 하세요</small>';
      } else if (phase === 'ready') {
        message = countdown ? countdown.toString() : 'GET READY..';
      } else if (phase === 'draw') {
        message = 'DRAW!!';
        // Start capture timer (1.5 seconds)
        setTimeout(() => {
          if (this.currentPhase === 'draw') {
            this.capturePlayerChoice();
          }
        }, 1500);
      } else if (phase === 'result') {
        message = ''; // Result will be shown separately
      }

      this.onPhaseChange(phase, message);
    }
  }

  /**
   * Capture player's choice during DRAW phase
   */
  capturePlayerChoice() {
    // This will be called from main.js with the detected pose
    // For now, just trigger the result phase
    this.showResult();
  }

  /**
   * Set player choice (called from main.js)
   */
  setPlayerChoice(choice, imageData) {
    this.playerChoice = choice;
    this.capturedImage = imageData;
  }

  /**
   * Generate computer's random choice
   */
  generateComputerChoice() {
    const randomIndex = Math.floor(Math.random() * this.CHOICES.length);
    this.computerChoice = this.CHOICES[randomIndex];
    return this.computerChoice;
  }

  /**
   * Determine winner
   * @returns {string} 'win', 'lose', or 'draw'
   */
  determineWinner() {
    if (!this.playerChoice || !this.computerChoice) {
      return 'draw'; // No choice detected
    }

    if (this.playerChoice === this.computerChoice) {
      return 'draw';
    }

    // Rock Paper Scissors logic
    const winConditions = {
      '바위': '가위',      // Rock beats Scissors
      '가위': '보자기',    // Scissors beats Paper
      '보자기': '바위'     // Paper beats Rock
    };

    if (winConditions[this.playerChoice] === this.computerChoice) {
      return 'win';
    } else {
      return 'lose';
    }
  }

  /**
   * Show result and update score
   */
  showResult() {
    if (!this.isGameActive) return;

    // Generate computer choice
    this.generateComputerChoice();

    // Determine winner
    const result = this.determineWinner();

    // Update score
    if (result === 'win') {
      this.wins++;
    } else if (result === 'lose') {
      this.losses++;
    } else {
      this.draws++;
    }

    // Notify callbacks
    if (this.onScoreChange) {
      this.onScoreChange(this.wins, this.draws, this.losses);
    }

    if (this.onResult) {
      this.onResult(result, this.playerChoice, this.computerChoice);
    }

    // Set result phase
    this.setPhase('result');

    // Start next round after showing result
    setTimeout(() => {
      if (this.isGameActive) {
        this.startRound();
      }
    }, 3000); // 3 seconds to show result
  }

  /**
   * Get emoji for choice
   */
  getEmoji(choice) {
    return this.CHOICE_EMOJIS[choice] || '❓';
  }

  /**
   * Register phase change callback
   */
  setPhaseChangeCallback(callback) {
    this.onPhaseChange = callback;
  }

  /**
   * Register score change callback
   */
  setScoreChangeCallback(callback) {
    this.onScoreChange = callback;
  }

  /**
   * Register result callback
   */
  setResultCallback(callback) {
    this.onResult = callback;
  }

  /**
   * Get current game state
   */
  getGameState() {
    return {
      isActive: this.isGameActive,
      wins: this.wins,
      draws: this.draws,
      losses: this.losses,
      currentPhase: this.currentPhase,
      playerChoice: this.playerChoice,
      computerChoice: this.computerChoice
    };
  }
}

// Export to global scope
window.GameEngine = GameEngine;
