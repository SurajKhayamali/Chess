import { Pawn } from "../../Pawn";

export function checkIfEnPassantShouldBeAvailable(
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

export function setEnPassantAvailableAt(state, fileIndex, rankIndex) {
  const enPassantPossibleAt = state.getSquare(fileIndex, rankIndex);
  state.setEnPassantAvailableAt(enPassantPossibleAt);
}
