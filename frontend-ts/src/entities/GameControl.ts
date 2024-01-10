import { AI_TYPE, getMoveBasedOnAiType } from 'scripts/ai';
import {
  AI_THINKING_TIME,
  RANKS_LENGTH,
  SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS,
} from 'constants/game.constant';
import { PieceType, SquareHighlightModifiers } from 'enums/game.enum';
import { Pawn, Piece } from 'components/pieces';
import {
  handleEnPassantCaptureAvailability,
  handlePawnPromotion,
} from 'components/pieces/helpers/specialMoves';
import { Square } from 'components/Square';
import { GameState } from './GameState';

type HighlightedSquares = {
  [key in SquareHighlightModifiers]?: Square[];
};

export class GameControl {
  boardElement: HTMLDivElement;
  state: GameState;
  highlightedSquares: HighlightedSquares;
  selectedPiece: Piece | null;
  aiThinkingStartTimestamp: number | null;

  /**
   * Creates a new game control.
   *
   * @param boardElement
   * @param state
   */
  constructor(boardElement: HTMLDivElement, state: GameState) {
    this.boardElement = boardElement;
    this.state = state;

    this.highlightedSquares = SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.reduce(
      (accumulator, modifier) => {
        accumulator[modifier] = [];
        return accumulator;
      },
      {} as HighlightedSquares
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
        '.chess-board__player-name'
      );
      if (!this.state.isWhitesTurn) {
        this.boardElement.classList.add('chess-board__container--reverse');
        for (const playerName of playerNames) {
          playerName.classList.add('chess-board__player-name--reverse');
        }
      } else {
        this.boardElement.classList.remove('chess-board__container--reverse');
        for (const playerName of playerNames) {
          playerName.classList.remove('chess-board__player-name--reverse');
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
   * @param square
   * @param modifier The modifier to add to the class name.
   */
  isSquareHighlighted(square: Square, modifier: SquareHighlightModifiers) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return false;

    return this.highlightedSquares[modifier]?.includes(square) ?? false;
  }

  /**
   * Highlights a square on the board with a given modifier.
   *
   * @param fileIndex The file index of the square to highlight.
   * @param rankIndex The rank index of the square to highlight.
   * @param modifier The modifier to add to the class name.
   */
  highlightSquare(
    fileIndex: number,
    rankIndex: number,
    modifier: SquareHighlightModifiers
  ) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    const square = this.state.getSquare(fileIndex, rankIndex);
    if (!square) return;

    square.highlight(modifier);
    this.highlightedSquares[modifier]?.push(square);
  }

  /**
   * Removes a highlight styling from all square and resets the highlighted squares for a given modifier on the board.
   *
   * @param modifier The modifier to add to the class name.
   */
  removeHighlightFromSquare(modifier: SquareHighlightModifiers) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    for (const square of this.highlightedSquares[modifier] || []) {
      square.removeHighlight(modifier);
    }
    this.highlightedSquares[modifier] = [];
  }

  /**
   * Handles a piece being clicked or dragged.
   *
   * @param piece The piece that was clicked.
   */
  handlePieceClickOrDrag(piece: Piece) {
    if (!this.state.hasGameStarted || this.state.hasGameEnded) return;
    if (piece.isWhite !== this.isWhitesTurn) return;

    this.selectedPiece = piece;

    this.removeHighlightFromSquare(SquareHighlightModifiers.SELECTED);

    this.highlightSquare(
      piece.fileIndex,
      piece.rankIndex,
      SquareHighlightModifiers.SELECTED
    );

    this.removeHighlightFromSquare(SquareHighlightModifiers.VALID);
    this.removeHighlightFromSquare(SquareHighlightModifiers.CAPTURABLE);

    // const currentPlayersKing = this.state.currentPlayer.king;
    // log("currentPlayersKing.isInCheck:", currentPlayersKing.isInCheck);
    // TODO: Check if the king can move out of check or if a piece can block the check;

    const { possibleMoves, capturablePieces } = piece.possibleMoves;
    for (const [fileIndex, rankIndex] of possibleMoves) {
      this.highlightSquare(
        fileIndex,
        rankIndex,
        SquareHighlightModifiers.VALID
      );
    }
    for (const [fileIndex, rankIndex] of capturablePieces) {
      this.highlightSquare(
        fileIndex,
        rankIndex,
        SquareHighlightModifiers.CAPTURABLE
      );
    }
  }

  /**
   * Checks if the target square was highlighted as a valid or capturable.
   *
   * @param fileIndex The file index of the target square.
   * @param rankIndex The rank index of the target square.
   *
   * @returns {boolean} Whether the target square was highlighted as a valid or capturable.
   */
  _checkIfTargetSquareWasHighlightedAsLegalMove(
    fileIndex: number,
    rankIndex: number
  ) {
    const wasTargetSquareHighlightedAsValid = this.highlightedSquares[
      SquareHighlightModifiers.VALID
    ]?.some(
      (square) =>
        square.fileIndex === fileIndex && square.rankIndex === rankIndex
    );
    const wasTargetSquareHighlightedAsCapturable = this.highlightedSquares[
      SquareHighlightModifiers.CAPTURABLE
    ]?.some(
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
   * @param fileIndex The file index of the square to move the piece to.
   * @param rankIndex The rank index of the square to move the piece to.
   */
  handleMoveSelectedPieceTo(fileIndex: number, rankIndex: number) {
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
        handlePawnPromotion(
          this.state,
          this.selectedPiece as Pawn,
          PieceType.QUEEN
        );
      }
    }

    this.removeHighlightFromSquare(SquareHighlightModifiers.LAST_MOVE);

    this.highlightSquare(
      oldFileIndex,
      oldRankIndex,
      SquareHighlightModifiers.LAST_MOVE
    );
    this.highlightSquare(
      fileIndex,
      rankIndex,
      SquareHighlightModifiers.LAST_MOVE
    );

    this.removeHighlightFromSquare(SquareHighlightModifiers.SELECTED);
    this.removeHighlightFromSquare(SquareHighlightModifiers.VALID);
    this.removeHighlightFromSquare(SquareHighlightModifiers.CAPTURABLE);
    this.fixBoardOrientation();
    this.selectedPiece = null;
  }

  /**
   * Returns the pieces on a square.
   *
   * @param fileIndex The file index of the square.
   * @param rankIndex The rank index of the square.
   *
   * @returns The pieces on the square or null if there are no pieces on the square.
   */
  getPiecesOnSquare(fileIndex: number, rankIndex: number) {
    return this.state.getPiece(fileIndex, rankIndex);
  }

  /**
   * Returns the en passant square if it is available.
   *
   * @return The en passant square or null if it is not available.
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
          this.state.currentPlayer.aiType as AI_TYPE
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
