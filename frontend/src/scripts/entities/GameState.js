import { FILES_LENGTH, RANKS_LENGTH } from "../constants/constants";
import { displayCheckmate } from "../message";
import { checkIfSameColor, log } from "../utils";
import { King, Pawn, Piece } from "./components/pieces";
import { checkIfKingIsInCheck } from "./components/pieces/helpers/kingInCheck.helper";
import {
  handleCastlingMove,
  handleEnPassantCapture,
} from "./components/pieces/helpers/specialMoves";
import { Square } from "./components/Square";
import { Player } from "./Player";
import { AudioPlayer } from "./AudioPlayer";

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

/**
 * @typedef {Object} ValidMove
 * @property {Piece} piece The piece that was moved.
 * @property {number} fileIndex The new file index of the piece.
 * @property {number} rankIndex The new rank index of the piece.
 */

export class GameState {
  /**
   * Creates a new game state.
   *
   * @param {Piece[][]} initialBoardState The initial board state.
   * @param {string} player1Name The name of player 1.
   * @param {string} player2Name The name of player 2.
   * @param {boolean} isWhitesTurn Whether it is white's turn.
   */
  constructor(initialBoardState, player1Name, player2Name, isWhitesTurn) {
    this.initialBoardState = initialBoardState; // 2D array of pieces

    this.squares = []; // 2D array of squares
    this.currentBoardState = initialBoardState; // 2D array of pieces
    this.player1 = new Player(player1Name, true, this);
    this.player2 = new Player(player2Name, false, this);
    this.isWhitesTurn = isWhitesTurn;

    this.moves = [];

    this.enPassantAvailableAt = null;

    this.initializeSquaresAndPieces();

    this.hasGameStarted = false;
    this.hasGameEnded = false;
    this.winner = null;

    this.control = null;

    this.audioPlayer = new AudioPlayer();
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
   * Returns the oponent player.
   *
   * @returns {Player}
   */
  get oponentPlayer() {
    return this.isWhitesTurn ? this.player2 : this.player1;
  }

  /**
   * Returns whether the game is player vs player.
   *
   * @returns {boolean}
   */
  get isPlayerVsPlayer() {
    return !this.player1.isComputer && !this.player2.isComputer;
  }

  /**
   * Sets the control.
   *
   * @param {GameControl} control The control to set.
   */
  setControl(control) {
    this.control = control;
  }

  /**
   * Resets the pieces positions.
   * This is used when the new game is started.
   */
  resetPiecesPositions() {
    for (let rankIndex = 0; rankIndex < RANKS_LENGTH; rankIndex++) {
      for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
        const piece = this.getPiece(fileIndex, rankIndex);
        if (!piece) continue;

        piece.handleResetAt(fileIndex, rankIndex);
      }
    }
  }

  /**
   * Starts a new game.
   */
  newGame() {
    this.currentBoardState = [...this.initialBoardState.map((arr) => [...arr])]; // 2D array of piece

    this.moves = [];

    this.enPassantAvailableAt = null;

    this.resetSquaresAndPieces();

    this.hasGameStarted = false;
    this.hasGameEnded = false;
    this.winner = null;

    this.control.reset();
    this.resetPiecesPositions();
  }

  /**
   * Starts the game.
   */
  startGame() {
    this.newGame();
    this.hasGameStarted = true;
  }

  /**
   * Ends the game.
   *
   * @param {Player?} winner The winner of the game if there is one (null if draw).
   */
  endGame(winner = null) {
    if (!winner) {
      this.audioPlayer.playDraw();
    } else if (winner.isWhite === this.player1.isWhite) {
      this.audioPlayer.playCheckmate();
    } else {
      this.audioPlayer.playCheckmateLose();
    }

    this.hasGameEnded = true;
    this.winner = winner;
  }

  /**
   * Initializes the squares and pieces on the board.
   */
  initializeSquaresAndPieces() {
    this.squares = [];
    for (let rankIndex = 0; rankIndex < RANKS_LENGTH; rankIndex++) {
      this.squares.push([]);

      for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
        const piece = this.getPiece(fileIndex, rankIndex);
        const square = new Square(fileIndex, rankIndex, piece);

        this.squares[rankIndex].push(square);
      }
    }
  }

  /**
   * Resets the squares and pieces on the board.
   */
  resetSquaresAndPieces() {
    for (let rankIndex = 0; rankIndex < RANKS_LENGTH; rankIndex++) {
      for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
        const piece = this.getPiece(fileIndex, rankIndex);

        if (piece) this.squares[rankIndex][fileIndex].setPiece(piece);
        else this.squares[rankIndex][fileIndex].removePiece();
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
   * @example getPiecesOfName("Pawn", true) // returns all white pawns
   * @example getPiecesOfName("Knight", false) // returns all black knights
   */
  getPiecesOfName(name, isWhite) {
    return this.getPieces().filter(
      (piece) => piece.name === name && checkIfSameColor(piece.isWhite, isWhite)
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
    if (!this.hasGameStarted || this.hasGameEnded) return;

    if (!this.checkIfMoveIsLegal(movedPiece, fileIndex, rankIndex)) {
      log("Illegal move");
      this.audioPlayer.playIllegalMove();
      return false;
    }

    // Check and get if there is a piece on the target square
    let capturedPiece = this.getPiece(fileIndex, rankIndex);
    log("capturedPiece:", capturedPiece, "at", fileIndex, rankIndex);

    if (capturedPiece instanceof King) {
      log("Game over");
      this.endGame(this.currentPlayer);
      displayCheckmate(this.currentPlayer.name, this.oponentPlayer.name);
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

    // Record the move
    this.recordAndMove(movedPiece, fileIndex, rankIndex, capturedPiece);

    this.isWhitesTurn = !this.isWhitesTurn;

    return true;
  }

  /**
   * Undoes the last move.
   *
   * @returns {boolean} Whether the move was undone.
   */
  undoLastMove() {
    if (this.moves.length === 0) return false;

    const lastMove = this.moves.pop();

    const {
      piece,
      oldFileIndex,
      oldRankIndex,
      fileIndex,
      rankIndex,
      capturedPiece,
    } = lastMove;

    // Move the piece back to the old square
    this.movePiece(piece, oldFileIndex, oldRankIndex);

    // Remove the piece from the new square
    this.removePieceAtSquare(fileIndex, rankIndex);

    // Replace the captured piece if there was one
    if (capturedPiece) {
      this.replacePieceAtSquare(capturedPiece, fileIndex, rankIndex);
      capturedPiece.flip();
    }

    this.isWhitesTurn = !this.isWhitesTurn;
    this.control.flipBoard();
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
   * Records the move and moves the piece.
   *
   * @param {Piece} movedPiece The piece to move.
   * @param {number} fileIndex The file index to move to.
   * @param {number} rankIndex The rank index to move to.
   * @param {Piece?} capturedPiece The piece that was captured.
   */
  recordAndMove(movedPiece, fileIndex, rankIndex, capturedPiece = null) {
    if (capturedPiece) {
      this.audioPlayer.playCapture();
    } else {
      this.audioPlayer.playMove();
    }

    const { fileIndex: oldFileIndex, rankIndex: oldRankIndex } = movedPiece;

    // Move the piece to new square
    this.movePiece(movedPiece, fileIndex, rankIndex);
    log("movedPiece:", movedPiece, "to", fileIndex, rankIndex);

    checkIfKingIsInCheck(this, movedPiece.isWhite);

    const { isInCheck: isOponentsKingInCheck } = checkIfKingIsInCheck(
      this,
      !movedPiece.isWhite
    );

    this.moves.push({
      piece: movedPiece,
      oldFileIndex,
      oldRankIndex,
      fileIndex,
      rankIndex,
      capturedPiece: capturedPiece,
      isCheck: isOponentsKingInCheck,
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

  /**
   * Returns if the square is occupied.
   *
   * @param {number} fileIndex The file index of the square to check.
   * @param {number} rankIndex The rank index of the square to check.
   *
   * @returns {boolean} Whether the square is occupied.
   */
  isSquareOccupied(fileIndex, rankIndex) {
    return this.getPiece(fileIndex, rankIndex) !== null;
  }

  /**
   * Returns if the square is occupied or under attack.
   *
   * @param {number} fileIndex The file index of the square to check.
   * @param {number} rankIndex The rank index of the square to check.
   *
   * @returns {boolean} Whether the square is occupied or under attack.
   */
  isSquareOccupiedOrUnderAttack(fileIndex, rankIndex, isWhite) {
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

  /**
   * Switches the player 2 to computer.
   * This is called when playing against computer is selected.
   *
   * @param {string} aiTypeForPlayer2 selected AI type for player 2
   */
  switchToPlayerVsComputer(aiTypeForPlayer2) {
    this.player1.switchToPlayer();
    this.player2.switchToComputer(aiTypeForPlayer2);
  }

  /**
   * Switches both players to computer.
   * This is called when computer vs computer mode is selected.
   *
   * @param {string} aiTypeForPlayer1 selected AI type for player 1
   * @param {string} aiTypeForPlayer2 selected AI type for player 2
   */
  switchToComputerVsComputer(aiTypeForPlayer1, aiTypeForPlayer2) {
    this.player1.switchToComputer(aiTypeForPlayer1);
    this.player2.switchToComputer(aiTypeForPlayer2);
  }

  /**
   * Switches both players to player.
   * This is called when player vs player mode is selected. default
   */
  switchToPlayerVsPlayer() {
    this.player1.switchToPlayer();
    this.player2.switchToPlayer();
  }
}
