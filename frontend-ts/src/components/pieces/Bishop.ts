import { PieceType } from 'enums/game.enum';
import { Piece, PieceConstructorArgsWithoutName } from './Piece';

export class Bishop extends Piece {
  constructor(...args: PieceConstructorArgsWithoutName) {
    super(PieceType.BISHOP, ...args);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAllDiagonals();
  }
}
