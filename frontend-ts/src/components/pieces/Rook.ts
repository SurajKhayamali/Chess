import { PieceType } from 'enums/game.enum';
import { Piece, PieceConstructorArgsWithoutName } from './Piece';

export class Rook extends Piece {
  constructor(...args: PieceConstructorArgsWithoutName) {
    super(PieceType.ROOK, ...args);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAxes();
  }
}
