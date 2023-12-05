class Board {
  constructor(isWhitesTurn) {
    this.board = [];
    this.initializeBoard();
    this.isWhitesTurn = isWhitesTurn;
  }

  initializeBoard() {
    this.board = INITIAL_BOARD;
  }
}
