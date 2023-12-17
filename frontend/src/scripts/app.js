import { BOARD_ID } from "./constants/constants";
import { generateBoardWithFENString } from "./parseFEN";

function render() {
  const board = generateBoardWithFENString(BOARD_ID);
  board.render();
  board.reEvaluateGameState();
}

render();
