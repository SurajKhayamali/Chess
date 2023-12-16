import { displayDraw, displayResignation, displayTurn } from "../message";
import { log } from "../utils";

export class UIControl {
  constructor(board) {
    this.board = board;
    this.playersHtml = document.querySelector(".game-info__players");
    this.playerNames = document.querySelectorAll(".game-info__player-name");

    this.drawButton = document.querySelector(".game-info__button--draw");
    this.resignButton = document.querySelector(".game-info__button--resign");

    this.initializeEventListenerForGameStartButton();
    this.initializeEventListenerForUndoButton();
    this.initializeEventListenerForDrawButton();
    this.initializeEventListenerForResignButton();
    this.renderLoop();
  }

  get gameState() {
    return this.board.gameState;
  }

  initializeEventListenerForGameStartButton() {
    const gameStartButton = document.querySelector(".new-game__button");
    gameStartButton.addEventListener("click", () => {
      this.gameState.startGame();

      const gameStartSection = document.querySelector(".new-game");
      gameStartSection.classList.add("hidden");

      const gameInfoSection = document.querySelector(".game-info");
      gameInfoSection.classList.remove("hidden");
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

  updatePlayerNames() {
    if (this.playerNames.length !== 2) return;
    this.playerNames[0].textContent = this.board.player1Name;
    this.playerNames[1].textContent = this.board.player2Name;
  }

  renderLoop() {
    if (this.gameState.hasGameEnded) return;

    this.updatePlayerNames();
    displayTurn(this.gameState.currentPlayer.name);

    if (!this.gameState.isWhitesTurn) {
      this.playersHtml.classList.add("game-info__players--reverse");
    } else {
      this.playersHtml.classList.remove("game-info__players--reverse");
    }

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
