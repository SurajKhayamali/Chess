import {
  HIGHLIGHT_MODIFIERS,
  SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS,
} from "../constants/constants";
import { log } from "../utils";
import { Piece } from "./components/pieces";
import { Square } from "./components/Square";

export class GameControl {
  /**
   * Creates a new game control.
   *
   * @param {HTMLDivElement} boardElement
   * @param {GameState} state
   */
  constructor(boardElement, state) {
    this.boardElement = boardElement;
    this.state = state;

    this.highlightedSquares = SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.reduce(
      (accumulator, modifier) => {
        accumulator[modifier] = [];
        return accumulator;
      },
      {}
    );
    this.selectedPiece = null;
  }

  /**
   * Returns whether it is white's turn.
   *
   * @returns {boolean}
   */
  get isWhitesTurn() {
    return this.state.isWhitesTurn;
  }

  /**
   * Flips the board.
   */
  flipBoard() {
    if (this.state.isPvP) {
      this.boardElement.classList.toggle("chess-board__container--reverse");

      for (const piece of this.state.getPieces()) {
        piece.flip();
      }
    }
  }

  /**
   * Is square included in the modifier's highlighted squares.
   *
   * @param {Square} square
   * @param {"selected" | "valid" | "last-move" | "hover"} modifier The modifier to add to the class name.
   *
   * @returns {boolean}
   */
  isSquareHighlighted(square, modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return false;

    return this.highlightedSquares[modifier].includes(square);
  }

  /**
   * Highlights a square on the board.
   *
   * @param {number} fileIndex The file index of the square to highlight.
   * @param {number} rankIndex The rank index of the square to highlight.
   * @param {"selected" | "valid" | "last-move" | "hover"} modifier The modifier to add to the class name.
   */
  highlightSquare(fileIndex, rankIndex, modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    const square = this.state.getSquare(fileIndex, rankIndex);
    square.highlight(modifier);
    this.highlightedSquares[modifier].push(square);
  }

  /**
   * Removes a highlight styling from all square for a given modifier on the board.
   *
   * @param {"selected" | "valid" | "last-move" | "hover"} modifier The modifier to add to the class name.
   */
  removeHighlightFromSquare(modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    for (const square of this.highlightedSquares[modifier]) {
      square.removeHighlight(modifier);
    }
    this.highlightedSquares[modifier] = [];
  }

  /**
   * Handles a piece being clicked or dragged.
   *
   * @param {Piece} piece The piece that was clicked.
   */
  handlePieceClickOrDrag(piece) {
    if (piece.isWhite !== this.isWhitesTurn) return;

    this.selectedPiece = piece;

    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.SELECTED);

    this.highlightSquare(
      piece.fileIndex,
      piece.rankIndex,
      HIGHLIGHT_MODIFIERS.SELECTED
    );

    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.VALID);
    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.CAPTURABLE);

    const currentPlayersKing = this.state.currentPlayer.king;
    // log("currentPlayersKing:", currentPlayersKing);
    log("currentPlayersKing.isInCheck:", currentPlayersKing.isInCheck);

    // console.log("state")
    const { possibleMoves, capturablePieces } = piece.getPossibleMoves();
    console.log("possibleMoves", possibleMoves);
    for (const [fileIndex, rankIndex] of possibleMoves) {
      console.log("currentPlayersKing", currentPlayersKing);
      if (!currentPlayersKing.isInCheck) {
        this.highlightSquare(fileIndex, rankIndex, HIGHLIGHT_MODIFIERS.VALID);
        continue;
      }
      // TODO: Check if the king can move out of check or if a piece can block the check;
      console.log("if king in check, state:", this.state);
      log(
        "doesMoveBlockOrEscapeCheck",
        this.state.doesMoveBlockOrEscapeCheck(piece, fileIndex, rankIndex)
      );
    }
    for (const [fileIndex, rankIndex] of capturablePieces) {
      this.highlightSquare(
        fileIndex,
        rankIndex,
        HIGHLIGHT_MODIFIERS.CAPTURABLE
      );
    }
  }

  /**
   * Moves the selected piece to the specified square.
   *
   * @param {number} fileIndex The file index of the square to move the piece to.
   * @param {number} rankIndex The rank index of the square to move the piece to.
   */
  moveSelectedPieceTo(fileIndex, rankIndex) {
    const wasTargetSquareHighlighted = this.highlightedSquares.valid.some(
      (square) =>
        square.fileIndex === fileIndex && square.rankIndex === rankIndex
    );
    if (!this.selectedPiece || !wasTargetSquareHighlighted) return;

    const moveExecuted = this.state.executeMove(
      this.selectedPiece,
      fileIndex,
      rankIndex
    );
    if (!moveExecuted) return;

    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.LAST_MOVE);

    const { fileIndex: oldFileIndex, rankIndex: oldRankIndex } =
      this.selectedPiece;
    this.highlightSquare(
      oldFileIndex,
      oldRankIndex,
      HIGHLIGHT_MODIFIERS.LAST_MOVE
    );
    this.highlightSquare(fileIndex, rankIndex, HIGHLIGHT_MODIFIERS.LAST_MOVE);

    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.SELECTED);
    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.VALID);
    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.CAPTURABLE);
    this.flipBoard();
    this.selectedPiece = null;
  }

  /**
   * Returns the pieces on a square.
   *
   * @param {number} fileIndex The file index of the square.
   * @param {number} rankIndex The rank index of the square.
   *
   * @returns {Piece?} The pieces on the square or null if there are no pieces on the square.
   */
  getPiecesOnSquare(fileIndex, rankIndex) {
    return this.state.getPiece(fileIndex, rankIndex);
  }
}
