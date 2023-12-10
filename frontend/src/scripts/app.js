import { Board } from "./entities/components/Board";
import { BOARD_ID } from "./constants/constants";

function render() {
  const board = new Board(BOARD_ID, true);
  board.render();
}

render();
