import {
  FILES_LENGTH,
  PIECE_HIGHLIGHT_MODIFIERS,
  RANKS_LENGTH,
} from "../constants/constants";
import { log } from "../utils";
import { King, Piece } from "./components/pieces";
import { Square } from "./components/Square";
import { ComputerPlayer, Player } from "./Player";

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
    this.player1 = new Player(true, this);
    this.player2 = isPvP
      ? new Player(false, this)
      : new ComputerPlayer(false, this);
    this.isWhitesTurn = isWhitesTurn;

    this.selectedPiece = null;
    this.moves = [];

    this.initializeSquaresAndPieces();
  }

  /**
   * Returns the current player whose turn it is.
   *
   * @returns {Player}
   */
  get currentPlayer() {
    return this.isWhitesTurn ? this.player1 : this.player2;
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
    if (
      fileIndex < 0 ||
      fileIndex > FILES_LENGTH - 1 ||
      rankIndex < 0 ||
      rankIndex > RANKS_LENGTH - 1
    )
      return null;

    return this.currentBoardState[rankIndex][fileIndex] ?? null;
  }

  /**
   * Returns all pieces of the specified type and color.
   *
   * @param {string} type The type of the pieces to get.
   * @param {boolean} isWhite Whether the pieces to get are white.
   *
   * @returns {Piece[]} The pieces of the specified type and color.
   *
   * @example getPiecesOfType("Pawn", true) // returns all white pawns
   * @example getPiecesOfType("Knight", false) // returns all black knights
   */
  getPiecesOfType(type, isWhite) {
    return this.getPieces().filter(
      (piece) => piece.name === type && piece.isWhite === isWhite
    );
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
    if (
      fileIndex < 0 ||
      fileIndex > FILES_LENGTH - 1 ||
      rankIndex < 0 ||
      rankIndex > RANKS_LENGTH - 1
    )
      return null;

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
    const { possibleMoves, capturablePieces } = piece.getPossibleMoves();
    const isMovePossible = possibleMoves.some(
      (move) => move[0] === fileIndex && move[1] === rankIndex
    );
    const isCaptureLegal = capturablePieces.some(
      (piece) => piece.fileIndex === fileIndex && piece.rankIndex === rankIndex
    );
    return isMovePossible || isCaptureLegal;
  }

  /**
   * Checks if the king is in check
   *
   * @param {Piece} movedPiece The piece that was moved.
   * @param {boolean} isWhiteKingToBeChecked Whether the white king is to be checked.
   *
   * @returns {{isInCheck: boolean, oponentsKing: Piece}} Whether the king is in check and the king piece.
   */
  checkIfKingIsInCheck(movedPiece, isWhiteKingToBeChecked) {
    // Find the king to be checked
    const king = this.getPieces().find(
      (piece) =>
        piece instanceof King && piece.isWhite === isWhiteKingToBeChecked
    );
    const { fileIndex: kingFileIndex, rankIndex: kingRankIndex } = king;

    // Check if the moved piece can attack the oponent's king
    const { capturablePieces } = movedPiece.getPossibleMoves();
    // log("capturablePieces:", capturablePieces, "king:", king);
    const isInCheck = capturablePieces.some(
      (move) => move[0] === kingFileIndex && move[1] === kingRankIndex
    );
    // log("isInCheck:", isInCheck);

    return { isInCheck, king };
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
    const { fileIndex: oldFileIndex, rankIndex: oldRankIndex } = movedPiece;

    // Check and get if there is a piece on the target square
    const capturedPiece = this.getPiece(fileIndex, rankIndex);
    log("capturedPiece:", capturedPiece, "at", fileIndex, rankIndex);

    // Move the piece to new square
    this._movePiece(movedPiece, fileIndex, rankIndex);
    log("movedPiece:", movedPiece, "to", fileIndex, rankIndex);

    const { isInCheck: isOponentsKingInCheck, king: oponentsKing } =
      this.checkIfKingIsInCheck(movedPiece, !movedPiece.isWhite);
    // log(
    //   "isOponentsKingInCheck:",
    //   isOponentsKingInCheck,
    //   "oponentsKing:",
    //   oponentsKing
    // );

    oponentsKing.updateIsInCheck(isOponentsKingInCheck);

    isOponentsKingInCheck
      ? oponentsKing.highlight(PIECE_HIGHLIGHT_MODIFIERS.CHECKED)
      : oponentsKing.removeHighlight(PIECE_HIGHLIGHT_MODIFIERS.CHECKED);

    // Record the move
    this.recordMove(
      movedPiece,
      fileIndex,
      rankIndex,
      capturedPiece,
      isOponentsKingInCheck
    );

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

  /**
   * Returns if the square is under attack by the oponent.
   *
   * @param {number} fileIndex The file index of the square to check.
   * @param {number} rankIndex The rank index of the square to check.
   * @param {boolean} isWhite Whether the square is white.
   *
   * @returns {boolean} Whether the square is under attack.
   */
  isSquareUnderAttack(fileIndex, rankIndex, isWhite) {
    // For this case, we are not considering oponent's king if it has not moved as it is not possible to attack current player's castling squares from the initial position
    // Also it solves the maximum call stack size exceeded error as breaks the loop on checking each other kings castling possibility squares
    const oponentsPieces = this.getPieces().filter((piece) => {
      const isOponentColor = piece.isWhite !== isWhite; // If the piece is of oponent's color
      const ifOponentsKingHasMoved = piece instanceof King && piece.hasMoved; // If the piece is the king and it has moved

      return isOponentColor && ifOponentsKingHasMoved;
    });

    for (const piece of oponentsPieces) {
      const { possibleMoves, capturablePieces } = piece.getPossibleMoves();
      if (
        possibleMoves.some(
          (move) => move[0] === fileIndex && move[1] === rankIndex
        ) ||
        capturablePieces.some(
          (move) => move[0] === fileIndex && move[1] === rankIndex
        )
      )
        return true;
    }

    return false;
  }

  isSquareOccupied(fileIndex, rankIndex) {
    return this.getPiece(fileIndex, rankIndex) !== null;
  }

  isSquareOccupiedOrUnderAttack(fileIndex, rankIndex, isWhite) {
    // console.log(
    //   "checking isSquareOccupiedOrUnderAttack",
    //   this.isSquareOccupied(fileIndex, rankIndex),
    //   this.isSquareUnderAttack(fileIndex, rankIndex, isWhite),
    //   fileIndex,
    //   rankIndex,
    //   isWhite
    // );
    return (
      this.isSquareOccupied(fileIndex, rankIndex) ||
      this.isSquareUnderAttack(fileIndex, rankIndex, isWhite)
    );
  }
}
