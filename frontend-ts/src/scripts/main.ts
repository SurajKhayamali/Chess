// import { Chess } from 'chess.js';
// import { Board } from './components/Board';
import { BOARD_ID } from './constants/game.constant';
import { generateBoardWithFENString } from './parseFEN';

// const chess = new Chess();
// console.log(chess.ascii());
// console.log(chess.board());

// while (!chess.isGameOver()) {
//   const moves = chess.moves();
//   const move = moves[Math.floor(Math.random() * moves.length)];
//   chess.move(move);
// }
// console.log(chess.pgn());

// const board = new Board(BOARD_ID, chess);

// board.render();

// console.log('rendering');
function render() {
  const board = generateBoardWithFENString(BOARD_ID);
  board.render();
  board.reEvaluateGameState();
}

render();
