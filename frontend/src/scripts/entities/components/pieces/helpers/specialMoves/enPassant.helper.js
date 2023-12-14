import { GameState } from "../../../../GameState";
import { Pawn } from "../../Pawn";
import { getRankIndexIncrement } from "../common.helper";

/**
 * Returns whether en passant should be available for the next move.
 *
 * @param {GameState} state
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @param {boolean} isWhite
 *
 * @returns {boolean} Whether en passant should be available for the next move.
 */
function checkIfEnPassantShouldBeAvailable(
  state,
  fileIndex,
  rankIndex,
  isWhite
) {
  const existingPieceAtLeft = state.getPiece(fileIndex - 1, rankIndex);
  const existingPieceAtRight = state.getPiece(fileIndex + 1, rankIndex);

  const enPassantPossibleFromLeft = existingPieceAtLeft
    ? existingPieceAtLeft.isWhite !== isWhite &&
      existingPieceAtLeft instanceof Pawn
    : false;
  const enPassantPossibleFromRight = existingPieceAtRight
    ? existingPieceAtRight.isWhite !== isWhite &&
      existingPieceAtRight instanceof Pawn
    : false;

  return enPassantPossibleFromLeft || enPassantPossibleFromRight;
}

/**
 * Sets the en passant square.
 *
 * @param {GameState} state
 * @param {number} fileIndex
 * @param {number} rankIndex
 */
function setEnPassantAvailableAt(state, fileIndex, rankIndex) {
  const enPassantPossibleAt = state.getSquare(fileIndex, rankIndex);
  state.setEnPassantAvailableAt(enPassantPossibleAt);
}

/**
 * Handles the availability check for en passant capture.
 * Sets the en passant square if en passant capture is possible.
 *
 * @param {GameState} state
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @param {boolean} isWhite
 */
export function handleEnPassantCaptureAvailability(
  state,
  fileIndex,
  rankIndex,
  isWhite
) {
  const shouldEnPassantBeAvailableForNextMove =
    checkIfEnPassantShouldBeAvailable(state, fileIndex, rankIndex, isWhite);

  if (shouldEnPassantBeAvailableForNextMove) {
    const rankIndexIncrement = getRankIndexIncrement(isWhite);
    setEnPassantAvailableAt(
      state,
      fileIndex,
      rankIndex - rankIndexIncrement * 1
    );
  }
}

/**
 * Checks if the move is an en passant capture.
 *
 * @param {GameState} state
 * @param {number} fileIndex
 * @param {number} rankIndex
 *
 * @returns {boolean} Whether the move is an en passant capture.
 */
function checkIfEnPassantCapture(state, fileIndex, rankIndex) {
  if (!state.enPassantAvailableAt) return false;

  const { fileIndex: epFileIndex, rankIndex: epRankIndex } =
    state.enPassantAvailableAt;

  if (fileIndex !== epFileIndex || rankIndex !== epRankIndex) return false;

  state.enPassantAvailableAt = null;

  return true;
}

/**
 * Returns the captured piece in an en passant capture.
 *
 * @param {GameState} state
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @param {boolean} isWhite
 *
 * @returns {Piece?} The captured piece or null if the move is not an en passant capture.
 */
function getEnPassantCapturedPiece(state, fileIndex, rankIndex, isWhite) {
  if (!checkIfEnPassantCapture(state, fileIndex, rankIndex)) return null;

  const rankIndexIncrement = getRankIndexIncrement(isWhite);
  const capturedPiece = state.getPiece(
    fileIndex,
    rankIndex - rankIndexIncrement * 1
  );
  return capturedPiece;
}

/**
 * Handles the en passant capture.
 * Checks if the move is an en passant capture and removes the captured pawn.
 * Returns the captured pawn.
 *
 * @param {GameState} state
 * @param {number} fileIndex
 * @param {number} rankIndex
 * @param {boolean} isWhite
 *
 * @returns {Piece?} The captured pawn or null if the move is not an en passant capture.
 */
export function handleEnPassantCapture(state, fileIndex, rankIndex, isWhite) {
  const capturedPiece = getEnPassantCapturedPiece(
    state,
    fileIndex,
    rankIndex,
    isWhite
  );

  if (!capturedPiece) return null;

  // removeEnPassantCapturedPiece(state, fileIndex, rankIndex, isWhite);
  state.removePieceAtSquare(
    fileIndex,
    rankIndex - 1 * getRankIndexIncrement(isWhite)
  );

  return capturedPiece;
}
