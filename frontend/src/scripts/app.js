import { Board } from "./Entities/Board";
import { BOARD_ID } from "./constants";

function render() {
  const board = new Board(BOARD_ID, true);
  board.render();
}

render();
