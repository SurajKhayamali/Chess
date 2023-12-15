import {
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} from "../entities/components/pieces";

// const FEN_STRING = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";  // Initial board state
// const FEN_STRING =
//   "r3k2r/pbpp1ppp/1pn1pn2/1B4q1/1b4Q1/1PN1PN2/PBPP1PPP/R3K2R w KQkq - 6 8"; // Castling on both sides
const FEN_STRING =
  "rnbqkbnr/ppppp1pp/5p2/7Q/8/4P3/PPPP1PPP/RNB1KBNR b KQkq - 1 2"; // Check condition

// Completely generated by github co-pilot
function parseFENString(fenString) {
  const [pieces, turn, castling, enPassant, halfMoveClock, fullMoveNumber] =
    fenString.split(" ");

  const board = [];
  const ranks = pieces.split("/");
  for (const rank of ranks) {
    const boardRank = [];
    for (const piece of rank) {
      if (isNaN(piece)) {
        boardRank.push(piece);
      } else {
        for (let i = 0; i < parseInt(piece); i++) {
          boardRank.push(null);
        }
      }
    }
    board.push(boardRank);
  }

  return {
    board,
    turn,
    castling,
    enPassant,
    halfMoveClock,
    fullMoveNumber,
  };
}
// console.log(parseFENString(FEN_STRING));

function getPieceClass(piece) {
  switch (piece) {
    case "p":
      return Pawn;
    case "n":
      return Knight;
    case "b":
      return Bishop;
    case "r":
      return Rook;
    case "q":
      return Queen;
    case "k":
      return King;
    default:
      throw new Error(`Invalid piece ${piece}`);
  }
}

function boardToBoardState(board) {
  const boardState = [];
  for (let rankIndex = 0; rankIndex < board.length; rankIndex++) {
    const rank = board[rankIndex];
    const boardRank = [];
    for (let fileIndex = 0; fileIndex < rank.length; fileIndex++) {
      const piece = rank[fileIndex];
      if (piece) {
        const isWhite = piece === piece.toUpperCase();
        const pieceClass = getPieceClass(piece.toLowerCase());
        boardRank.push(new pieceClass(isWhite, 7 - fileIndex, 7 - rankIndex));
      } else {
        boardRank.push(null);
      }
    }
    boardState.push(boardRank.reverse());
  }
  return boardState.reverse();
}

// export const INITIAL_BOARD_STATE = [
//   [
//     new Rook(true, 0, 0),
//     new Knight(true, 1, 0),
//     new Bishop(true, 2, 0),
//     new Queen(true, 3, 0),
//     new King(true, 4, 0),
//     new Bishop(true, 5, 0),
//     new Knight(true, 6, 0),
//     new Rook(true, 7, 0),
//   ],
//   [
//     new Pawn(true, 0, 1),
//     new Pawn(true, 1, 1),
//     new Pawn(true, 2, 1),
//     new Pawn(true, 3, 1),
//     new Pawn(true, 4, 1),
//     new Pawn(true, 5, 1),
//     new Pawn(true, 6, 1),
//     new Pawn(true, 7, 1),
//   ],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [
//     new Pawn(false, 0, 6),
//     new Pawn(false, 1, 6),
//     new Pawn(false, 2, 6),
//     new Pawn(false, 3, 6),
//     new Pawn(false, 4, 6),
//     new Pawn(false, 5, 6),
//     new Pawn(false, 6, 6),
//     new Pawn(false, 7, 6),
//   ],
//   [
//     new Rook(false, 0, 7),
//     new Knight(false, 1, 7),
//     new Bishop(false, 2, 7),
//     new Queen(false, 3, 7),
//     new King(false, 4, 7),
//     new Bishop(false, 5, 7),
//     new Knight(false, 6, 7),
//     new Rook(false, 7, 7),
//   ],
// ];

export const INITIAL_BOARD_STATE = boardToBoardState(
  parseFENString(FEN_STRING).board
);
