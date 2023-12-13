import { PIECES } from "../../../constants/constants";
import { Piece } from "./Piece";

export class Queen extends Piece {
  constructor(...args) {
    super(PIECES.QUEEN, ...args);
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
