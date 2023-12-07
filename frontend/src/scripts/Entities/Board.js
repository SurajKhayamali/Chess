import { SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS } from "../constants";
import { getSquareColor, getSquareId } from "../utils";
// import { Bishop, King, Knight, Pawn, Queen, Rook } from "./Piece";
import { Player } from "./Player";
import { Square } from "./Square";

export class Board {
  /**
   * Creates a new board.
   *
   * @param {string} boardId The id of the HTML element that will contain the board.
   * @param {boolean} isWhitesTurn Whether it is white's turn.
   */
  constructor(boardId, isWhitesTurn) {
    this.boardId = boardId;
    this.isWhitesTurn = isWhitesTurn;
    this.board = [];
    this.squares = [];
    this.highlightedSquares = SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.reduce(
      (accumulator, modifier) => {
        accumulator[modifier] = [];
        return accumulator;
      },
      {}
    );

    this.player1 = new Player(true);
    this.player2 = new Player(false);
    this.initializeSquares();
    // this.initializeBoard();
    this.reorganizeBoard();

    this.selectedPiece = null;
    this.moves = [];
  }

  initializeSquares() {
    this.squares = [];
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      this.squares.push([]);

      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const square = new Square(fileIndex, rankIndex);
        const squareElement = square.getHtmlElement();

        squareElement.addEventListener("dragenter", (event) => {
          if (!this.highlightedSquares.valid?.includes(square)) return;

          square.highlight("hover");
        });
        squareElement.addEventListener("dragleave", (event) => {
          if (!this.highlightedSquares.valid?.includes(square)) return;

          square.removeHighlight("hover");
        });
        squareElement.addEventListener("drop", (event) => {
          // console.log("drop at ", square);
          const { fileIndex, rankIndex } = square;
          this.moveSelectedPieceTo(fileIndex, rankIndex);
        });
        squareElement.addEventListener("dragover", (event) => {
          event.preventDefault();
        });

        this.squares[rankIndex].push(square);
      }
    }
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
   * Highlights a square on the board.
   *
   * @param {number} fileIndex The file index of the square to highlight.
   * @param {number} rankIndex The rank index of the square to highlight.
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
   */
  highlightSquare(fileIndex, rankIndex, modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    const square = this.squares[rankIndex][fileIndex];
    square.highlight(modifier);
    this.highlightedSquares[modifier].push(square);
  }

  /**
   * Removes a highlight styling from all square for a given modifier on the board.
   *
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
   */
  removeHighlightFromSquare(modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    for (const square of this.highlightedSquares[modifier]) {
      square.removeHighlight(modifier);
    }
    this.highlightedSquares[modifier] = [];
  }

  /**
   * Handles a piece being clicked or dragged.
   *
   * @param {Piece} piece The piece that was clicked.
   */
  handlePieceClickOrDrag(piece) {
    if (piece.isWhite !== this.isWhitesTurn) return;

    this.selectedPiece = piece;

    this.removeHighlightFromSquare("selected");

    this.squares[piece.rankIndex][piece.fileIndex].highlight("selected");
    this.highlightSquare(piece.fileIndex, piece.rankIndex, "selected");

    this.removeHighlightFromSquare("valid");

    const possibleMoves = piece.getPossibleMoves();
    for (const [fileIndex, rankIndex] of possibleMoves) {
      this.squares[rankIndex][fileIndex].highlight("valid");
      this.highlightSquare(fileIndex, rankIndex, "valid");
    }
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

  moveSelectedPieceTo(fileIndex, rankIndex) {
    const wasTargetSquareHighlighted = this.highlightedSquares.valid.some(
      (square) =>
        square.fileIndex === fileIndex && square.rankIndex === rankIndex
    );
    if (!this.selectedPiece || !wasTargetSquareHighlighted) return;

    const oldFileIndex = this.selectedPiece.fileIndex;
    const oldRankIndex = this.selectedPiece.rankIndex;
    this.moves.push({
      piece: this.selectedPiece,
      oldFileIndex,
      oldRankIndex,
      fileIndex,
      rankIndex,
    });

    this.selectedPiece.moveTo(fileIndex, rankIndex);
    this.board[rankIndex][fileIndex] = this.selectedPiece;
    this.board[oldRankIndex][oldFileIndex] = null;

    // this.reorganizeBoard();
    this.render();
    this.selectedPiece = null;
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
        const square = this.squares[rankIndex][fileIndex];
        const squareHtml = square.getHtmlElement();

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
