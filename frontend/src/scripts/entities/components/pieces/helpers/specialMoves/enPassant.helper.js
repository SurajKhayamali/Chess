import { Pawn } from "../../Pawn";
import { getRankIndexIncrement } from "../common.helper";

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

function setEnPassantAvailableAt(state, fileIndex, rankIndex) {
  const enPassantPossibleAt = state.getSquare(fileIndex, rankIndex);
  state.setEnPassantAvailableAt(enPassantPossibleAt);
}

export function handleEnPassantCapture(state, fileIndex, rankIndex, isWhite) {
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
