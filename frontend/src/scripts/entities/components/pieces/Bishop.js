import { PIECES } from "../../../constants/constants";
import { Piece } from "./Piece";

export class Bishop extends Piece {
  constructor(...args) {
    super(PIECES.BISHOP, ...args);
  }

  getPossibleMoves() {
    return this.getPossibleMovesAcrossAllDiagonals();
  }
}
