import { FILES_LENGTH, RANKS_LENGTH } from "../constants";
import { INITIAL_BOARD_STATE } from "../gameState.constant";
import { GameControl } from "./GameContorl";
import { GameState } from "./GameState";

export class Board {
  /**
   * Creates a new board.
   *
   * @param {string} boardId The id of the HTML element that will contain the board.
   * @param {boolean} isWhitesTurn Whether it is white's turn.
   * @param {boolean} isPvP Whether the game is player vs player.
   */
  constructor(boardId, isPvP = true, isWhitesTurn = true) {
    this.boardId = boardId;
    this.htmlElement = document.getElementById(boardId);
    if (!this.htmlElement)
      throw new Error(`Element with id ${boardId} not found`);

    this.gameState = new GameState(INITIAL_BOARD_STATE, isPvP, isWhitesTurn);
    this.control = new GameControl(
      this.htmlElement,
      this.gameState,
      isWhitesTurn
    );
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
   * Renders the board along with the pieces.
   *
   * @returns {HTMLDivElement} The board element.
   */
  render() {
    const boardHtml = this.htmlElement;
    boardHtml.innerHTML = "";

    for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
      const rowHtml = this.generateRow();

      for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
        const square = this.gameState.getSquare(fileIndex, rankIndex);
        const squareHtml = square.getHtmlElement();

        square.setControl(this.control);

        const piece = this.gameState.getPiece(fileIndex, rankIndex);

        if (piece) {
          square.setPiece(piece);
          piece.setControl(this.control);
        }

        rowHtml.appendChild(squareHtml);
      }

      boardHtml.appendChild(rowHtml);
    }

    return boardHtml;
  }
}
