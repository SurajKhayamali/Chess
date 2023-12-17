import { evaluate } from "../evaluate";

export class ChessEngine {
  constructor(boardState) {
    this.boardState = boardState;
    this.depth = 0;
  }

  setBoardState(boardState) {
    this.boardState = boardState;
  }

  getBoardState() {
    return this.boardState;
  }

  getDepth() {
    return this.depth;
  }

  setDepth(depth) {
    this.depth = depth;
  }

  evaluate() {
    return evaluate(this.boardState, this.depth);
  }
}
