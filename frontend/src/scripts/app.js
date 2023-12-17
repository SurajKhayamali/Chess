import { BOARD_ID } from "./constants/constants";
import { generateBoardWithFENString } from "./parseFEN";

function render() {
  const board = generateBoardWithFENString(BOARD_ID);
  window.board = board;
  board.render();
}

render();
