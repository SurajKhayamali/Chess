import { Board } from "./Entities/Board.js";
import { BOARD_ID } from "./constants.js";

function render() {
  const board = new Board(BOARD_ID, true);
  board.render();
}

render();
