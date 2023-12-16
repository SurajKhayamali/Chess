export class UIControl {
  constructor(board) {
    this.board = board;

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
    const playerNames = document.querySelectorAll(".game-info__player-name");
    if (playerNames.length !== 2) return;
    playerNames[0].textContent = this.board.player1Name;
    playerNames[1].textContent = this.board.player2Name;
  }

  renderLoop() {
    this.updatePlayerNames();
    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
