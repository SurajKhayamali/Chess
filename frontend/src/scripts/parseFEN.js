import { DEFAULT_FEN_STRING } from "./constants/gameState.constant";
import { Board } from "./entities/components/Board";
import {
  Bishop,
  King,
  Knight,
  Pawn,
  Queen,
  Rook,
} from "./entities/components/pieces";

// Completely generated by github co-pilot
export function parseFENString(fenString) {
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

export const generateBoardWithFENString = (
  BOARD_ID,
  isPlayerVsPlayer = true,
  fenString = DEFAULT_FEN_STRING
) => {
  const { board, turn } = parseFENString(fenString);
  const state = boardToBoardState(board);

  return new Board(
    BOARD_ID,
    state,
    isPlayerVsPlayer,
    turn ? turn === "w" : true
  );
};
