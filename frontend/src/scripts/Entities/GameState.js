import { ComputerPlayer, Player } from "./Player";
import { Square } from "./Square";

export class GameState {
  /**
   * Creates a new game state.
   *
   * @param {Piece[][]} initialBoardState The initial board state.
   * @param {boolean} isPvP Whether the game is player vs player.
   * @param {boolean} isWhitesTurn Whether it is white's turn.
   */
  constructor(initialBoardState, isPvP, isWhitesTurn) {
    this.squares = []; // 2D array of squares

    this.currentBoardState = initialBoardState; // 2D array of pieces
    this.isPvP = isPvP;
    this.player1 = new Player(true);
    this.player2 = isPvP ? new Player(false) : new ComputerPlayer(false);
    this.isWhitesTurn = true;

    this.selectedPiece = null;
    this.moves = [];

    this.initializeSquaresAndPieces();
  }

  /**
   * Initializes the squares and pieces on the board.
   */
  initializeSquaresAndPieces() {
    this.squares = [];
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      this.squares.push([]);

      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const piece = this.getPiece(fileIndex, rankIndex);
        const square = new Square(fileIndex, rankIndex, piece);

        this.squares[rankIndex].push(square);
      }
    }
  }

  /**
   * Returns all pieces on the board.
   */
  getPieces() {
    return this.currentBoardState.flat().filter((piece) => piece !== null);
  }

  /**
   * Returns the piece at the specified square.
   *
   * @param {number} fileIndex The file index of the square to get the piece from.
   * @param {number} rankIndex The rank index of the square to get the piece from.
   *
   * @returns {Piece} The piece at the specified square.
   */
  getPiece(fileIndex, rankIndex) {
    return this.currentBoardState[rankIndex][fileIndex] ?? null;
  }

  /**
   * Returns the square at the specified coordinates.
   *
   * @param {number} fileIndex The file index of the square to get.
   * @param {number} rankIndex The rank index of the square to get.
   *
   * @returns {Square?} The square at the specified coordinates.
   */
  getSquare(fileIndex, rankIndex) {
    return this.squares[rankIndex][fileIndex] ?? null;
  }
}
