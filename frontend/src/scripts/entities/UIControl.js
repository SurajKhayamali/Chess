import {
  displayDraw,
  displayResignation,
  displayTurn,
  displayWinByTime,
} from "../message";
import { log } from "../utils";
import { Timer } from "./Timer";

const DEFAULT_GAME_TIME_IN_SECONDS = 10 * 60;

export class UIControl {
  constructor(board) {
    this.board = board;
    this.gameStartSection = document.querySelector(".new-game");
    this.newGameInput = document.querySelector(".new-game__input");
    this.gameInfoSection = document.querySelector(".game-info");
    this.playersHtml = document.querySelector(".game-info__players");
    this.playerNames = document.querySelectorAll(".game-info__player-name");
    this.playerTimes = document.querySelectorAll(".game-info__player-time");
    this.buttonsDuringGame = document.querySelector(".during-game");
    this.buttonsAfterGame = document.querySelector(".after-game");

    this.timeDuration = DEFAULT_GAME_TIME_IN_SECONDS;

    this.player1Timer = new Timer(this.playerTimes[0], this.timeDuration);
    this.player2Timer = new Timer(this.playerTimes[1], this.timeDuration);

    this.initializeEventListenerForGameStartButton();
    this.initializeEventListenerForUndoButton();
    this.initializeEventListenerForDrawButton();
    this.initializeEventListenerForResignButton();
    this.initializeEventListenerForNewGameButton();
    this.initializeEventListenerForRestartButton();
    this.renderLoop();
  }

  /**
   * Returns the game state.
   *
   * @returns {GameState}
   */
  get gameState() {
    return this.board.gameState;
  }

  /**
   * Initializes the event listener for the game start button.
   * When the button is clicked, the game starts.
   * The game start section is hidden and the game info section is shown.
   */
  initializeEventListenerForGameStartButton() {
    const gameStartButton = document.querySelector(".new-game__button");
    gameStartButton.addEventListener("click", () => {
      const selectedTime = this.newGameInput.value;
      if (selectedTime) {
        this.timeDuration =
          parseInt(selectedTime) || DEFAULT_GAME_TIME_IN_SECONDS;
        this.player1Timer.updateInitialTime(this.timeDuration);
        this.player2Timer.updateInitialTime(this.timeDuration);
      }

      this.gameState.startGame();

      this.gameStartSection.classList.add("hidden");

      this.gameInfoSection.classList.remove("hidden");
    });
  }

  /**
   * Initializes the event listener for the undo button.
   * When the button is clicked, the last move is undone.
   */
  initializeEventListenerForUndoButton() {
    const undoButton = document.querySelector(".game-info__button--undo");
    undoButton.addEventListener("click", () => {
      // log("Undo button clicked");
      this.gameState.undoLastMove();
    });
  }

  /**
   * Initializes the event listener for the draw button.
   * When the button is clicked, the game ends in a draw.
   */
  initializeEventListenerForDrawButton() {
    const drawButton = document.querySelector(".game-info__button--draw");
    drawButton.addEventListener("click", () => {
      if (this.gameState.hasGameEnded) return;

      this.gameState.endGame();
      displayDraw();
    });
  }

  /**
   * Initializes the event listener for the resign button.
   * When the button is clicked, the game ends in a resignation.
   * The player who clicked the button loses.
   * The other player wins.
   */
  initializeEventListenerForResignButton() {
    const resignButton = document.querySelector(".game-info__button--resign");
    resignButton.addEventListener("click", () => {
      // log("Resign button clicked");
      if (this.gameState.hasGameEnded) return;

      this.gameState.endGame(this.gameState.oponentPlayer);
      displayResignation(this.gameState.oponentPlayer.name);
    });
  }

  /**
   * Initializes the event listener for the new game button.
   * When the button is clicked, a new game is started.
   * The timers are reset.
   * The game start section is shown and the game info section is hidden.
   */
  initializeEventListenerForNewGameButton() {
    const newGameButton = document.querySelector(".game-info__button--new");
    newGameButton.addEventListener("click", () => {
      // log("New game button clicked");
      this.gameState.newGame();
      this.resetTimers();

      this.gameStartSection.classList.remove("hidden");
      this.gameInfoSection.classList.add("hidden");
    });
  }

  /**
   * Initializes the event listener for the restart button.
   * When the button is clicked, the game is restarted.
   * The timers are reset.
   */
  initializeEventListenerForRestartButton() {
    const restartButton = document.querySelector(".game-info__button--restart");
    restartButton.addEventListener("click", () => {
      // log("Restart button clicked");
      this.gameState.startGame();
      this.resetTimers();
    });
  }

  /**
   * Updates the player names.
   * The player names are updated based on the board state.
   */
  updatePlayerNames() {
    if (this.playerNames.length !== 2) return;
    this.playerNames[0].textContent = this.board.player1Name;
    this.playerNames[1].textContent = this.board.player2Name;
  }

  /**
   * Switches the timer.
   * The timer is switched based on player's turn switch.
   */
  switchTimer() {
    if (this.gameState.isWhitesTurn) {
      this.player1Timer.start();
      this.player2Timer.stop();
    } else {
      this.player1Timer.stop();
      this.player2Timer.start();
    }
  }

  /**
   * Stops the current player's timer.
   */
  stopTimer() {
    if (this.gameState.isWhitesTurn) {
      this.player1Timer.stop();
    } else {
      this.player2Timer.stop();
    }
  }

  /**
   * Resets the timers.
   * The timers are reset to their initial values.
   */
  resetTimers() {
    this.player1Timer.reset();
    this.player2Timer.reset();
  }

  /**
   * Handles the time out.
   * If the time is out, the game ends.
   * The player who's time is out loses.
   * The other player wins.
   * The winner is displayed.
   * The timers are stopped.
   */
  handleTimeOut() {
    if (this.player1Timer.time <= 0) {
      this.gameState.endGame(this.gameState.player2);
      displayWinByTime(this.gameState.player2.name);

      this.player1Timer.stop();
    } else if (this.player2Timer.time <= 0) {
      this.gameState.endGame(this.gameState.player1);
      displayWinByTime(this.gameState.player1.name);

      this.player2Timer.stop();
    }
  }

  /**
   * The render loop is used to update the UI on every frame.
   */
  renderLoop() {
    if (this.gameState.hasGameEnded) {
      this.buttonsDuringGame.classList.add("hidden");
      this.buttonsAfterGame.classList.remove("hidden");

      this.stopTimer();
    } else {
      this.buttonsDuringGame.classList.remove("hidden");
      this.buttonsAfterGame.classList.add("hidden");

      this.updatePlayerNames();
      displayTurn(this.gameState.currentPlayer.name);

      this.handleTimeOut();

      if (!this.gameState.isWhitesTurn) {
        this.playersHtml.classList.add("game-info__players--reverse");

        this.player1Timer.stop();
        this.player2Timer.start();
      } else {
        this.playersHtml.classList.remove("game-info__players--reverse");

        this.player2Timer.stop();
        this.player1Timer.start();
      }
    }

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
