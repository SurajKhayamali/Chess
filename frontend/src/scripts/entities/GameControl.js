import { DEFAULT_AI_TYPE, getMoveBasedOnAiType } from "../ai";
import {
  AI_THINKING_TIME,
  HIGHLIGHT_MODIFIERS,
  PIECES,
  RANKS_LENGTH,
  SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS,
} from "../constants/constants";
// import { log } from "../utils";
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

    this.aiThinkingStartTimestamp = null;
    this.handleAIsTurn();
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
   * Resets the game control state.
   * This is called when the game is restarted.
   */
  reset() {
    this.selectedPiece = null;

    for (const modifier of SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS) {
      this.removeHighlightFromSquare(modifier);
    }
  }

  /**
   * Fixes the board orientation.
   */
  fixBoardOrientation() {
    if (this.state.isPlayerVsPlayer) {
      const playerNames = this.boardElement.querySelectorAll(
        ".chess-board__player-name"
      );
      if (!this.state.isWhitesTurn) {
        this.boardElement.classList.add("chess-board__container--reverse");
        for (const playerName of playerNames) {
          playerName.classList.add("chess-board__player-name--reverse");
        }
      } else {
        this.boardElement.classList.remove("chess-board__container--reverse");
        for (const playerName of playerNames) {
          playerName.classList.remove("chess-board__player-name--reverse");
        }
      }

      for (const piece of this.state.getPieces()) {
        piece.fixPieceOrientation();
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
   * Highlights a square on the board with a given modifier.
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
   * Removes a highlight styling from all square and resets the highlighted squares for a given modifier on the board.
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
    if (!this.state.hasGameStarted || this.state.hasGameEnded) return;
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
    this.fixBoardOrientation();
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

  /**
   * Handles the AI's turn.
   * This is called every frame.
   * The AI will make a move after a certain amount of time.
   * This is to prevent the AI from making a move instantly.
   * This is to make the game more realistic.
   * The AI will not make a move if the game has not started or has ended.
   * The AI will not make a move if it is not the AI's turn.
   * The AI will not make a move if the AI is not a computer.
   */
  handleAIsTurn() {
    if (
      this.state.currentPlayer.isComputer &&
      this.state.hasGameStarted &&
      !this.state.hasGameEnded
    ) {
      this.aiThinkingStartTimestamp =
        this.aiThinkingStartTimestamp ?? Date.now();

      if (this.aiThinkingStartTimestamp + AI_THINKING_TIME < Date.now()) {
        const { piece, fileIndex, rankIndex } = getMoveBasedOnAiType(
          this.state,
          this.state.currentPlayer.isWhite,
          this.state.currentPlayer.aiType
        );
        // log("Random move:", piece, fileIndex, rankIndex);
        this.handlePieceClickOrDrag(piece);
        this.handleMoveSelectedPieceTo(fileIndex, rankIndex);

        this.aiThinkingStartTimestamp = null;
      }
    }

    requestAnimationFrame(() => {
      this.handleAIsTurn();
    });
  }
}
