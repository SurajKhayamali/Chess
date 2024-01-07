import { PieceType } from '../../enums/game.enum';
import { Piece, PieceConstructorArgsWithoutName } from './Piece';

export class Knight extends Piece {
  constructor(...args: PieceConstructorArgsWithoutName) {
    super(PieceType.KNIGHT, ...args);
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
