import { PIECES } from "../../../constants/constants";
import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(isWhite, fileIndex, rankIndex, control, abbreviation = "N") {
    super(PIECES.KNIGHT, isWhite, fileIndex, rankIndex, control, abbreviation);
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePieces = [];
    const moveOffsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const moveOffset of moveOffsets) {
      const [fileOffset, rankOffset] = moveOffset;

      this._addToPossibleAndCapturableMoves(
        possibleMoves,
        capturablePieces,
        this.fileIndex + fileOffset,
        this.rankIndex + rankOffset
      );
    }

    return { possibleMoves, capturablePieces };
  }
}
