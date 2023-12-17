import { FILES_LENGTH, RANKS_LENGTH } from "./constants/constants";
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

/**
 * @typedef {Object} FENParsed
 * @property {string[][]} board
 * @property {string} turn
 * @property {string} castling
 * @property {string} enPassant
 * @property {string} halfMoveClock
 * @property {string} fullMoveNumber
 */

// Format of FEN string
// ${piecePlacement} {turn} {castling} ${enPassant} ${halfMoveClock} ${fullMoveNumber}
// where piecePlacement is of format ${pieces}/${pieces}/${pieces}/${pieces}/${pieces}/${pieces}/${pieces}/${pieces}
// turn could be w or b representing white and black
// castling could be KQkq or - representing castling availability, KQkq is for white king side, queen side and black king side, queen side
// enPassant could be a3 or - representing en passant availability
// halfMoveClock could be a number or - representing half move clock (number of half moves since last capture or pawn advance) for 50 move rule
// fullMoveNumber could be a number or - representing full move number (number of full moves since start of game, incremented after black move)

/**
 *
 * @param {string} fenString
 *
 * @returns {FENParsed}
 */
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
        const emptySquares = Array(parseInt(piece)).fill(null);
        boardRank.push(...emptySquares);
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

/**
 * Returns the piece class for the given piece.
 *
 * @param {string} piece The piece.
 *
 * @returns {Piece} The piece class.
 */
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

/**
 * Converts a board to a board state.
 *
 * @param {string[][]} board The board to convert.
 *
 * @returns {Piece[][]} The board state.
 */
function boardToBoardState(board) {
  const boardState = []; // 2D array of pieces
  for (let rankIndex = 0; rankIndex < board.length; rankIndex++) {
    const rank = board[rankIndex];
    const boardRank = []; // row of board
    for (let fileIndex = 0; fileIndex < rank.length; fileIndex++) {
      const piece = rank[fileIndex];
      if (piece) {
        const isWhite = piece === piece.toUpperCase();
        const PieceClass = getPieceClass(piece.toLowerCase());
        boardRank.push(
          new PieceClass(
            isWhite,
            FILES_LENGTH - fileIndex,
            RANKS_LENGTH - rankIndex
          )
        );
      } else {
        boardRank.push(null);
      }
    }
    boardState.push(boardRank.reverse());
  }
  return boardState.reverse();
}

/**
 * Generates a board with the given FEN string.
 *
 * @param {string} BOARD_ID The id of the board.
 * @param {boolean?} isPlayerVsPlayer Whether the game is player vs player.
 * @param {string?} fenString The fen string.
 *
 * @returns {Board} The generated board.
 */
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
