import { getSquareColor, getSquareId } from "../utils";
// import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";
import { Player } from "./Player";

export class Board {
  /**
   * Creates a new board.
   *
   * @param {string} boardId The id of the HTML element that will contain the board.
   * @param {boolean} isWhitesTurn Whether it is white's turn.
   */
  constructor(boardId, isWhitesTurn) {
    this.boardId = boardId;
    this.board = [];
    this.isWhitesTurn = isWhitesTurn;

    this.player1 = new Player(true);
    this.player2 = new Player(false);
    // this.initializeBoard();
    this.reorganizeBoard();
  }

  /**
   * Initializes the board with the default chess pieces in their starting positions.
   */
  // initializeBoard() {
  //   this.board = [
  //     [
  //       new Rook(false, 0, 0),
  //       new Knight(false, 1, 0),
  //       new Bishop(false, 2, 0),
  //       new Queen(false, 3, 0),
  //       new King(false, 4, 0),
  //       new Bishop(false, 5, 0),
  //       new Knight(false, 6, 0),
  //       new Rook(false, 7, 0),
  //     ],
  //     [
  //       new Pawn(false, 0, 1),
  //       new Pawn(false, 1, 1),
  //       new Pawn(false, 2, 1),
  //       new Pawn(false, 3, 1),
  //       new Pawn(false, 4, 1),
  //       new Pawn(false, 5, 1),
  //       new Pawn(false, 6, 1),
  //       new Pawn(false, 7, 1),
  //     ],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null],
  //     [
  //       new Pawn(true, 0, 6),
  //       new Pawn(true, 1, 6),
  //       new Pawn(true, 2, 6),
  //       new Pawn(true, 3, 6),
  //       new Pawn(true, 4, 6),
  //       new Pawn(true, 5, 6),
  //       new Pawn(true, 6, 6),
  //       new Pawn(true, 7, 6),
  //     ],
  //     [
  //       new Rook(true, 0, 7),
  //       new Knight(true, 1, 7),
  //       new Bishop(true, 2, 7),
  //       new Queen(true, 3, 7),
  //       new King(true, 4, 7),
  //       new Bishop(true, 5, 7),
  //       new Knight(true, 6, 7),
  //       new Rook(true, 7, 7),
  //     ],
  //   ];
  // }

  /**
   * Reorganizes the board array to match the current positions of the pieces.
   */
  reorganizeBoard() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board.push([]);
    }
    for (const piece of this.player1.pieces) {
      this.board[piece.rankIndex][piece.fileIndex] = piece;
    }
    for (const piece of this.player2.pieces) {
      this.board[piece.rankIndex][piece.fileIndex] = piece;
    }
  }

  /**
   * Generates a row for the chess board.
   *
   * @returns {HTMLDivElement} The row element.
   */
  generateRow() {
    const row = document.createElement("div");
    row.classList.add("chess-board__row");
    return row;
  }

  /**
   * Generates a square for the chess board.
   * @param {boolean} isLight Whether the square is light or dark.
   * @param {number} fileIndex The file index of the square.
   * @param {number} rankIndex The rank index of the square.
   *
   * @returns {HTMLDivElement} The square element.
   * @throws {Error} If the rank or file index is not a number between 0 and 7 or out of bounds.
   */
  generateSquare(fileIndex, rankIndex) {
    const squareId = getSquareId(fileIndex, rankIndex);

    const square = document.createElement("div");

    square.classList.add("chess-board__square");
    square.classList.add(
      `chess-board__square--${getSquareColor(fileIndex, rankIndex)}`
    );
    square.setAttribute("data-square", squareId);

    return square;
  }

  /**
   * Removes all previously highlighted squares.
   */
  removePreviouslyHighlightedSquares() {
    const previouslySelectedSquare = document.querySelector(
      ".chess-board__square--selected"
    );
    if (previouslySelectedSquare)
      previouslySelectedSquare.classList.remove(
        "chess-board__square--selected"
      );

    const previouslyHighlightedSquares = document.querySelectorAll(
      ".chess-board__square--valid"
    );
    for (const square of previouslyHighlightedSquares) {
      square.classList.remove("chess-board__square--valid");
    }
  }

  /**
   * Highlights a square on the board.
   *
   * @param {number} fileIndex The file index of the square.
   * @param {number} rankIndex The rank index of the square.
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
   */
  highlightSquare(fileIndex, rankIndex, modifier) {
    const square = document.querySelector(
      `[data-square="${getSquareId(fileIndex, rankIndex)}"]`
    );
    if (!square) return;

    square.classList.add(`chess-board__square--${modifier}`);
  }

  /**
   * Highlights multiple squares on the board. used for highlighting possible moves.
   *
   * @param {number[][]} squares The squares to highlight.
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
   */
  highlightSquares(squares, modifier) {
    for (const square of squares) {
      this.highlightSquare(square[0], square[1], modifier);
    }
  }

  /**
   * Handles a piece being clicked or dragged.
   *
   * @param {Piece} piece The piece that was clicked.
   */
  handlePieceClickOrDrag(piece) {
    if (piece.isWhite !== this.isWhitesTurn) return;

    const possibleMoves = piece.getPossibleMoves();

    this.removePreviouslyHighlightedSquares();
    this.highlightSquare(piece.fileIndex, piece.rankIndex, "selected");
    this.highlightSquares(possibleMoves, "valid");
  }

  /**
   * Initializes event listeners for a piece.
   *
   * @param {Piece} piece The piece to initialize event listeners for.
   */
  initializeEventListnersForPiece(piece) {
    piece.getHtmlElement().addEventListener("click", () => {
      this.handlePieceClickOrDrag(piece);
    });
    piece.getHtmlElement().addEventListener("dragstart", () => {
      this.handlePieceClickOrDrag(piece);
    });
  }

  /**
   * Renders the board along with the pieces.
   *
   * @returns {HTMLDivElement} The board element.
   */
  render() {
    const boardHtml = document.getElementById(this.boardId);
    if (!boardHtml) return;

    boardHtml.innerHTML = "";

    for (let rankIndex = this.board.length - 1; rankIndex >= 0; rankIndex--) {
      const rowHtml = this.generateRow();

      for (let fileIndex = 0; fileIndex < this.board.length; fileIndex++) {
        const squareHtml = this.generateSquare(fileIndex, rankIndex);

        const piece = this.board[rankIndex][fileIndex];

        if (piece) {
          this.initializeEventListnersForPiece(piece);
          squareHtml.appendChild(piece.getHtmlElement());
        }

        rowHtml.appendChild(squareHtml);
      }

      boardHtml.appendChild(rowHtml);
    }

    return boardHtml;
  }
}
