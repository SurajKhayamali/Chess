import { Board } from "./entities/components/Board";
import { BOARD_ID } from "./constants/constants";

const board = new Board(BOARD_ID, true);
window.board = board;

function render() {
  board.render();

  // requestAnimationFrame(render);
}

render();

setInterval(() => {
  // board.control.flipBoard();
  render();
}, 1000);
