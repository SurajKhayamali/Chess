import { displayDraw, displayResignation, displayTurn } from "../message";
import { log } from "../utils";

export class UIControl {
  constructor(board) {
    this.board = board;
    this.gameStartSection = document.querySelector(".new-game");
    this.gameInfoSection = document.querySelector(".game-info");
    this.playersHtml = document.querySelector(".game-info__players");
    this.playerNames = document.querySelectorAll(".game-info__player-name");
    this.buttonsDuringGame = document.querySelector(".during-game");
    this.buttonsAfterGame = document.querySelector(".after-game");

    this.initializeEventListenerForGameStartButton();
    this.initializeEventListenerForUndoButton();
    this.initializeEventListenerForDrawButton();
    this.initializeEventListenerForResignButton();
    this.initializeEventListenerForNewGameButton();
    this.initializeEventListenerForRestartButton();
    this.renderLoop();
  }

  get gameState() {
    return this.board.gameState;
  }

  initializeEventListenerForGameStartButton() {
    const gameStartButton = document.querySelector(".new-game__button");
    gameStartButton.addEventListener("click", () => {
      this.gameState.startGame();

      this.gameStartSection.classList.add("hidden");

      this.gameInfoSection.classList.remove("hidden");
    });
  }

  initializeEventListenerForUndoButton() {
    const undoButton = document.querySelector(".game-info__button--undo");
    undoButton.addEventListener("click", () => {
      // log("Undo button clicked");
      this.gameState.undoLastMove();
    });
  }

  initializeEventListenerForDrawButton() {
    const drawButton = document.querySelector(".game-info__button--draw");
    drawButton.addEventListener("click", () => {
      if (this.gameState.hasGameEnded) return;

      this.gameState.endGame();
      displayDraw();
    });
  }

  initializeEventListenerForResignButton() {
    const resignButton = document.querySelector(".game-info__button--resign");
    resignButton.addEventListener("click", () => {
      // log("Resign button clicked");
      if (this.gameState.hasGameEnded) return;

      this.gameState.endGame(this.gameState.oponentPlayer);
      displayResignation(this.gameState.oponentPlayer.name);
    });
  }

  initializeEventListenerForNewGameButton() {
    const newGameButton = document.querySelector(".game-info__button--new");
    newGameButton.addEventListener("click", () => {
      // log("New game button clicked");
      this.gameState.newGame();
    });
  }

  initializeEventListenerForRestartButton() {
    const restartButton = document.querySelector(".game-info__button--restart");
    restartButton.addEventListener("click", () => {
      // log("Restart button clicked");
      this.gameState.startGame();
    });
  }

  updatePlayerNames() {
    if (this.playerNames.length !== 2) return;
    this.playerNames[0].textContent = this.board.player1Name;
    this.playerNames[1].textContent = this.board.player2Name;
  }

  renderLoop() {
    if (!this.gameState.hasGameStarted) {
      this.gameStartSection.classList.remove("hidden");
      this.gameInfoSection.classList.add("hidden");
    } else {
      if (this.gameState.hasGameEnded) {
        this.buttonsDuringGame.classList.add("hidden");
        this.buttonsAfterGame.classList.remove("hidden");
      } else {
        this.buttonsDuringGame.classList.remove("hidden");
        this.buttonsAfterGame.classList.add("hidden");
        this.updatePlayerNames();
        displayTurn(this.gameState.currentPlayer.name);

        if (!this.gameState.isWhitesTurn) {
          this.playersHtml.classList.add("game-info__players--reverse");
        } else {
          this.playersHtml.classList.remove("game-info__players--reverse");
        }
      }
    }

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
