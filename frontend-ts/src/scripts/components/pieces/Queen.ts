import { PieceType } from '../../enums/game.enum';
import { Piece, PieceConstructorArgsWithoutName } from './Piece';

export class Queen extends Piece {
  constructor(...args: PieceConstructorArgsWithoutName) {
    super(PieceType.QUEEN, ...args);
  }

  getPossibleMoves() {
    const possibleMoves = [];
    const capturablePieces = [];

    const {
      possibleMoves: possibleMovesAcrossAxes,
      capturablePieces: capturablePieceAcrossAxes,
    } = this.getPossibleMovesAcrossAxes();
    possibleMoves.push(...possibleMovesAcrossAxes);
    capturablePieces.push(...capturablePieceAcrossAxes);

    const {
      possibleMoves: possibleMovesAcrossAllDiagonals,
      capturablePieces: capturablePieceAcrossAllDiagonals,
    } = this.getPossibleMovesAcrossAllDiagonals();
    possibleMoves.push(...possibleMovesAcrossAllDiagonals);
    capturablePieces.push(...capturablePieceAcrossAllDiagonals);

    return { possibleMoves, capturablePieces };
  }
}
