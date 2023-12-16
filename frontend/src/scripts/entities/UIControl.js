import { displayTurn } from "../message";

export class UIControl {
  constructor(board) {
    this.board = board;
    this.playersHtml = document.querySelector(".game-info__players");
    this.playerNames = document.querySelectorAll(".game-info__player-name");

    this.initializeEventListenerForGameStartButton();
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

  updatePlayerNames() {
    if (this.playerNames.length !== 2) return;
    this.playerNames[0].textContent = this.board.player1Name;
    this.playerNames[1].textContent = this.board.player2Name;
  }

  renderLoop() {
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
