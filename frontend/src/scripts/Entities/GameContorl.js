import { SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS } from "../constants";
import { Square } from "./Square";

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
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
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
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
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
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
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

    this.removeHighlightFromSquare("selected");

    this.state
      .getSquare(piece.fileIndex, piece.rankIndex)
      .highlight("selected");
    this.highlightSquare(piece.fileIndex, piece.rankIndex, "selected");

    this.removeHighlightFromSquare("valid");

    const possibleMoves = piece.getPossibleMoves();
    for (const [fileIndex, rankIndex] of possibleMoves) {
      this.state.getSquare(fileIndex, rankIndex).highlight("valid");
      this.highlightSquare(fileIndex, rankIndex, "valid");
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

    this.flipBoard();
    this.selectedPiece = null;
  }
}
