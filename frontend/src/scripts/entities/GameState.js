import { FILES_LENGTH, RANKS_LENGTH } from "../constants/constants";
import { log } from "../utils";
import { King, Pawn, Piece } from "./components/pieces";
import { checkIfKingIsInCheck } from "./components/pieces/helpers/kingInCheck.helper";
import {
  handleCastlingMove,
  handleEnPassantCapture,
} from "./components/pieces/helpers/specialMoves";
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
  constructor(
    initialBoardState,
    isPvP,
    player1Name,
    player2Name,
    isWhitesTurn
  ) {
    this.squares = []; // 2D array of squares

    this.currentBoardState = initialBoardState; // 2D array of pieces
    this.isPvP = isPvP;
    this.player1 = new Player(player1Name, true, this);
    this.player2 = isPvP
      ? new Player(player2Name, false, this)
      : new ComputerPlayer(player2Name, false, this);
    this.isWhitesTurn = isWhitesTurn;

    this.selectedPiece = null;
    this.moves = [];

    this.enPassantAvailableAt = null;

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
  movePiece(piece, fileIndex, rankIndex) {
    const { fileIndex: oldFileIndex, rankIndex: oldRankIndex } = piece;
    this.currentBoardState[oldRankIndex][oldFileIndex] = null;
    this.currentBoardState[rankIndex][fileIndex] = piece;
    piece.moveTo(fileIndex, rankIndex);

    // Capture piece if there is one
    this.replacePieceAtSquare(piece, fileIndex, rankIndex);

    // Remove piece from old square
    const oldSquare = this.getSquare(oldFileIndex, oldRankIndex);
    oldSquare.removePiece();

    this.reEvaluateMoves();
  }

  /**
   * Re-evaluates the moves of all pieces.
   */
  reEvaluateMoves() {
    this.getPieces().forEach((piece) => piece.reEvaluateMoves());
    this.getPieces().forEach((piece) => piece.reEvaluateSpecialMoves());
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
    const { possibleMoves, capturablePieces } = piece.possibleMoves;
    const isMovePossible = possibleMoves.some(
      (move) => move[0] === fileIndex && move[1] === rankIndex
    );
    const isCaptureLegal = capturablePieces.some(
      (move) => move[0] === fileIndex && move[1] === rankIndex
    );
    return isMovePossible || isCaptureLegal;
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

    // Check and get if there is a piece on the target square
    let capturedPiece = this.getPiece(fileIndex, rankIndex);
    log("capturedPiece:", capturedPiece, "at", fileIndex, rankIndex);

    if (capturedPiece instanceof King) {
      log("Game over");
      return false;
    }

    if (movedPiece instanceof King) {
      handleCastlingMove(this, movedPiece, fileIndex, rankIndex);
    } else if (movedPiece instanceof Pawn) {
      const enPassantCapturedPiece = handleEnPassantCapture(
        this,
        fileIndex,
        rankIndex,
        movedPiece.isWhite
      );
      log("enPassantCapturedPiece:", enPassantCapturedPiece);
      if (enPassantCapturedPiece) {
        capturedPiece = enPassantCapturedPiece;
      }
    }

    // Move the piece to new square
    this.movePiece(movedPiece, fileIndex, rankIndex);
    log("movedPiece:", movedPiece, "to", fileIndex, rankIndex);

    checkIfKingIsInCheck(this, movedPiece.isWhite);

    const { isInCheck: isOponentsKingInCheck } = checkIfKingIsInCheck(
      this,
      !movedPiece.isWhite
    );

    // Record the move
    this.recordMove(
      movedPiece,
      fileIndex,
      rankIndex,
      capturedPiece,
      isOponentsKingInCheck
    );

    this.isWhitesTurn = !this.isWhitesTurn;

    return true;
  }

  /**
   * Replace the piece at the specified square.
   *
   * @param {Piece} piece The piece to replace.
   * @param {number} fileIndex The file index of the square to replace the piece at.
   * @param {number} rankIndex The rank index of the square to replace the piece at.
   */
  replacePieceAtSquare(piece, fileIndex, rankIndex) {
    const square = this.getSquare(fileIndex, rankIndex);

    if (square.piece !== null) square.piece.remove();

    square.setPiece(piece);

    this.currentBoardState[rankIndex][fileIndex] = piece;
  }

  /**
   * Removes the piece at the specified square.
   *
   * @param {number} fileIndex The file index of the square to remove the piece from.
   * @param {number} rankIndex The rank index of the square to remove the piece from.
   */
  removePieceAtSquare(fileIndex, rankIndex) {
    const square = this.getSquare(fileIndex, rankIndex);

    if (square.piece !== null) square.piece.remove();

    square.removePiece();

    this.currentBoardState[rankIndex][fileIndex] = null;
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
      const ifOponentsKingHasNotMoved =
        piece instanceof King && !piece.hasMoved; // If the piece is the king and it has moved

      return isOponentColor && !ifOponentsKingHasNotMoved;
    });

    for (const piece of oponentsPieces) {
      const { possibleMoves, capturablePieces } = piece.possibleMoves;
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

  /**
   * Sets the en passant available at the specified square.
   *
   * @param {Square} square The square to set the en passant available at.
   */
  setEnPassantAvailableAt(square) {
    this.enPassantAvailableAt = square;
  }

  /**
   * Removes the en passant available at square.
   */
  removeEnPassantAvailableAt() {
    this.enPassantAvailableAt = null;
  }

  /**
   * Returns the player's king.
   *
   * @param {boolean} isWhite Whether the player is white.
   *
   * @returns {King} The player's king.
   */
  getPlayersKing(isWhite) {
    if (isWhite) return this.player1.king;

    return this.player2.king;
  }
}
