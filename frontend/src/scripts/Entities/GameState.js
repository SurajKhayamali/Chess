import { log } from "../utils";
import { King } from "./Piece";
import { ComputerPlayer, Player } from "./Player";
import { Square } from "./Square";

/**
 * @typedef {Object} Move
 * @property {Piece} piece The piece that was moved.
 * @property {number} oldFileIndex The old file index of the piece.
 * @property {number} oldRankIndex The old rank index of the piece.
 * @property {number} fileIndex The new file index of the piece.
 * @property {number} rankIndex The new rank index of the piece.
 * @property {Piece?} capturedPiece The piece that was captured.
 * @property {boolean} isCheck Whether the move resulted in a check.
 */

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
    this.isWhitesTurn = isWhitesTurn;

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

  /**
   * Moves a piece to the specified square.
   *
   * @param {Piece} piece The piece to move.
   * @param {number} fileIndex The file index to move to.
   * @param {number} rankIndex The rank index to move to.
   */
  _movePiece(piece, fileIndex, rankIndex) {
    this.currentBoardState[piece.rankIndex][piece.fileIndex] = null;
    this.currentBoardState[rankIndex][fileIndex] = piece;
    piece.moveTo(fileIndex, rankIndex);
  }

  /**
   * Checks if the move is legal.
   *
   * @param {Piece} piece The piece to move.
   * @param {number} fileIndex The file index to move to.
   * @param {number} rankIndex The rank index to move to.
   *
   * @returns {boolean} Whether the move is legal.
   */
  checkIfMoveIsLegal(piece, fileIndex, rankIndex) {
    const possibleMoves = piece.getPossibleMoves();
    const isMoveLegal = possibleMoves.some(
      (move) => move[0] === fileIndex && move[1] === rankIndex
    );
    return isMoveLegal;
  }

  /**
   * Executes a move.
   * @param {Piece} movedPiece The piece to move.
   * @param {number} fileIndex The file index to move to.
   * @param {number} rankIndex The rank index to move to.
   *
   * @returns {boolean} Whether the move was executed.
   */
  executeMove(movedPiece, fileIndex, rankIndex) {
    if (!this.checkIfMoveIsLegal(movedPiece, fileIndex, rankIndex)) {
      log("Illegal move");
      return false;
    }

    // Save old position to remove the piece from old square later
    const {
      fileIndex: oldFileIndex,
      rankIndex: oldRankIndex,
      isWhite,
    } = movedPiece;

    // Check and get if there is a piece on the target square
    const capturedPiece = this.getPiece(fileIndex, rankIndex);
    log("capturedPiece:", capturedPiece, "at", fileIndex, rankIndex);

    // Move the piece to new square
    this._movePiece(movedPiece, fileIndex, rankIndex);
    log("movedPiece:", movedPiece, "to", fileIndex, rankIndex);

    // Check if the move resulted in a check
    // Find the oponent's king
    const oponentsKing = this.getPieces().find(
      (piece) => piece.isWhite !== isWhite && piece instanceof King
    );
    const {
      fileIndex: oponentsKingFileIndex,
      rankIndex: oponentsKingRankIndex,
    } = oponentsKing;

    // Check if the moved piece can attack the oponent's king
    const possibleMoves = movedPiece.getPossibleMoves();
    const isCheck = possibleMoves.some(
      (move) =>
        move[0] === oponentsKingFileIndex && move[1] === oponentsKingRankIndex
    );
    log("isCheck:", isCheck);

    // Record the move
    this.recordMove(movedPiece, fileIndex, rankIndex, capturedPiece, isCheck);

    // Capture piece if there is one
    const targetSquare = this.getSquare(fileIndex, rankIndex);
    if (targetSquare.piece !== null) {
      targetSquare.piece.remove();
    }

    // Move piece to new square
    targetSquare.setPiece(movedPiece);

    // Remove piece from old square
    const oldSquare = this.getSquare(oldFileIndex, oldRankIndex);
    oldSquare.removePiece();

    this.isWhitesTurn = !this.isWhitesTurn;

    return true;
  }

  /**
   * Returns the player whose turn it is.
   *
   * @param {Move} move record.
   */
  recordMove(
    movedPiece,
    fileIndex,
    rankIndex,
    capturedPiece = null,
    isCheck = false
  ) {
    const { fileIndex: oldFileIndex, rankIndex: oldRankIndex } = movedPiece;

    this.moves.push({
      piece: movedPiece,
      oldFileIndex,
      oldRankIndex,
      fileIndex,
      rankIndex,
      capturedPiece: capturedPiece,
      isCheck: isCheck,
    });
  }
}
