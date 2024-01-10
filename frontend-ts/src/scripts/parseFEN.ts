import {
  FILES_LENGTH,
  RANKS_LENGTH,
  DEFAULT_FEN_STRING,
} from 'constants/game.constant';
import { Board } from 'components/Board';
import {
  Bishop,
  King,
  Knight,
  Pawn,
  Piece,
  Queen,
  Rook,
} from 'components/pieces';

interface FENParsed {
  board: string[][];
  turn: string;
  castling: string;
  enPassant: string;
  halfMoveClock: string;
  fullMoveNumber: string;
}

// Format of FEN string
// ${piecePlacement} {turn} {castling} ${enPassant} ${halfMoveClock} ${fullMoveNumber}
// where piecePlacement is of format ${pieces}/${pieces}/${pieces}/${pieces}/${pieces}/${pieces}/${pieces}/${pieces}
// turn could be w or b representing white and black
// castling could be KQkq or - representing castling availability, KQkq is for white king side, queen side and black king side, queen side
// enPassant could be a3 or - representing en passant availability
// halfMoveClock could be a number or - representing half move clock (number of half moves since last capture or pawn advance) for 50 move rule
// fullMoveNumber could be a number or - representing full move number (number of full moves since start of game, incremented after black move)

/**
 * Parses the FEN string.
 *
 * @param fenString
 */
export function parseFENString(fenString: string): FENParsed {
  const [pieces, turn, castling, enPassant, halfMoveClock, fullMoveNumber] =
    fenString.split(' ');

  const board = [];
  const ranks = pieces.split('/');
  for (const rank of ranks) {
    const boardRank = [];
    for (const piece of rank) {
      if (isNaN(Number(piece))) {
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
 * @param piece The piece.
 */
function getPieceClass(piece: string) {
  switch (piece) {
    case 'p':
      return Pawn;
    case 'n':
      return Knight;
    case 'b':
      return Bishop;
    case 'r':
      return Rook;
    case 'q':
      return Queen;
    case 'k':
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
function boardToBoardState(board: string[][]) {
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
            RANKS_LENGTH - rankIndex,
            undefined,
            piece.toUpperCase()
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
 * @param BOARD_ID The id of the board.
 * @param fenString The fen string.
 *
 * @returns The generated board.
 */
export const generateBoardWithFENString = (
  BOARD_ID: string,
  fenString = DEFAULT_FEN_STRING
) => {
  const { board, turn } = parseFENString(fenString);
  const state = boardToBoardState(board);

  return new Board(BOARD_ID, state as Piece[][], turn ? turn === 'w' : true);
};
