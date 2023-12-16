import {
  HIGHLIGHT_MODIFIERS,
  PIECES,
  RANKS_LENGTH,
  SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS,
} from "../constants/constants";
import { log } from "../utils";
import { Pawn, Piece } from "./components/pieces";
import {
  handleEnPassantCaptureAvailability,
  handlePawnPromotion,
} from "./components/pieces/helpers/specialMoves";
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

    if (!this.isWhitesTurn) this.flipBoard();
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
      const playerNames = this.boardElement.querySelectorAll(
        ".chess-board__player-name"
      );
      for (const playerName of playerNames) {
        playerName.classList.toggle("chess-board__player-name--reverse");
      }

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

    // const currentPlayersKing = this.state.currentPlayer.king;
    // log("currentPlayersKing.isInCheck:", currentPlayersKing.isInCheck);
    // TODO: Check if the king can move out of check or if a piece can block the check;

    const { possibleMoves, capturablePieces } = piece.possibleMoves;
    for (const [fileIndex, rankIndex] of possibleMoves) {
      this.highlightSquare(fileIndex, rankIndex, HIGHLIGHT_MODIFIERS.VALID);
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
   * Checks if the target square was highlighted as a valid or capturable.
   *
   * @param {number} fileIndex The file index of the target square.
   * @param {number} rankIndex The rank index of the target square.
   *
   * @returns {boolean} Whether the target square was highlighted as a valid or capturable.
   */
  _checkIfTargetSquareWasHighlightedAsLegalMove(fileIndex, rankIndex) {
    const wasTargetSquareHighlightedAsValid = this.highlightedSquares[
      HIGHLIGHT_MODIFIERS.VALID
    ].some(
      (square) =>
        square.fileIndex === fileIndex && square.rankIndex === rankIndex
    );
    const wasTargetSquareHighlightedAsCapturable = this.highlightedSquares[
      HIGHLIGHT_MODIFIERS.CAPTURABLE
    ].some(
      (square) =>
        square.fileIndex === fileIndex && square.rankIndex === rankIndex
    );
    return (
      wasTargetSquareHighlightedAsValid ||
      wasTargetSquareHighlightedAsCapturable
    );
  }

  /**
   * Moves the selected piece to the specified square.
   *
   * @param {number} fileIndex The file index of the square to move the piece to.
   * @param {number} rankIndex The rank index of the square to move the piece to.
   */
  moveSelectedPieceTo(fileIndex, rankIndex) {}

  /**
   * Handles the selected piece being moved to the specified square.
   *
   * @param {number} fileIndex The file index of the square to move the piece to.
   * @param {number} rankIndex The rank index of the square to move the piece to.
   */
  handleMoveSelectedPieceTo(fileIndex, rankIndex) {
    if (
      !this.selectedPiece ||
      !this._checkIfTargetSquareWasHighlightedAsLegalMove(fileIndex, rankIndex)
    )
      return;

    const {
      fileIndex: oldFileIndex,
      rankIndex: oldRankIndex,
      isWhite,
    } = this.selectedPiece;

    const moveExecuted = this.state.executeMove(
      this.selectedPiece,
      fileIndex,
      rankIndex
    );
    if (!moveExecuted) return;

    const wasMovedPiecePawn = this.selectedPiece instanceof Pawn;
    if (wasMovedPiecePawn) {
      if (Math.abs(rankIndex - oldRankIndex) === 2) {
        handleEnPassantCaptureAvailability(
          this.state,
          fileIndex,
          rankIndex,
          isWhite
        );
      } else if (rankIndex === 0 || rankIndex === RANKS_LENGTH - 1) {
        handlePawnPromotion(this.state, this.selectedPiece, PIECES.QUEEN);
      }
    }

    this.removeHighlightFromSquare(HIGHLIGHT_MODIFIERS.LAST_MOVE);

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

  /**
   * Returns the en passant square if it is available.
   *
   * @returns {Square?} The en passant square or null if it is not available.
   */
  getEnPassantAvailableAt() {
    return this.state.enPassantAvailableAt;
  }
}
