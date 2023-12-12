import { Piece } from "./Piece";

export class Knight extends Piece {
  constructor(isWhite, fileIndex, rankIndex) {
    super("Knight", isWhite, fileIndex, rankIndex, "N");
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
