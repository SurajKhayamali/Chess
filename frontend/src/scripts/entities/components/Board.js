import {
  FILES_LENGTH,
  HIGHLIGHT_MODIFIERS,
  RANKS_LENGTH,
} from "../../constants/constants";
import { GameControl } from "../GameControl";
import { GameState } from "../GameState";
import { Square } from "./Square";
import { checkIfKingIsInCheck } from "./pieces/helpers/kingInCheck.helper";

export class Board {
  /**
   * Creates a new board.
   *
   * @param {string} boardId The id of the HTML element that will contain the board.
   * @param {string} initialState The initial state of the board.
   * @param {boolean} isWhitesTurn Whether it is white's turn.
   * @param {boolean} isPvP Whether the game is player vs player.
   */
  constructor(boardId, initialState, isPvP = true, isWhitesTurn = true) {
    this.boardId = boardId;
    this.htmlElement = document.getElementById(boardId);
    if (!this.htmlElement)
      throw new Error(`Element with id ${boardId} not found`);

    this.gameState = new GameState(initialState, isPvP, isWhitesTurn);
    this.control = new GameControl(this.htmlElement, this.gameState);
  }

  /**
   * Initializes event listeners for a square.
   *
   * @param {Square} square The square to initialize event listeners for.
   */
  initializeEventListnersForSquare(square) {
    const squareElement = square.getHtmlElement();

    squareElement.addEventListener("dragenter", (event) => {
      if (!this.control.isSquareHighlighted(square, HIGHLIGHT_MODIFIERS.VALID))
        return;

      square.highlight(HIGHLIGHT_MODIFIERS.HOVER);
    });
    squareElement.addEventListener("dragleave", (event) => {
      if (!this.control.isSquareHighlighted(square, HIGHLIGHT_MODIFIERS.VALID))
        return;

      square.removeHighlight(HIGHLIGHT_MODIFIERS.HOVER);
    });
    squareElement.addEventListener("drop", (event) => {
      const { fileIndex, rankIndex } = square;
      this.control.handleMoveSelectedPieceTo(fileIndex, rankIndex);

      square.removeHighlight(HIGHLIGHT_MODIFIERS.HOVER);
    });
    squareElement.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
    squareElement.addEventListener("click", (event) => {
      const { fileIndex, rankIndex } = square;
      this.control.handleMoveSelectedPieceTo(fileIndex, rankIndex);

      square.removeHighlight(HIGHLIGHT_MODIFIERS.HOVER);
    });
  }

  /**
   * Generates the board container.
   *
   * @returns {HTMLDivElement} The board container element.
   */
  generateBoardContainer() {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("chess-board__board-container");
    return boardContainer;
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
   * Generates a player name element.
   * @param {boolean} isWhite Whether the player is white.
   *
   * @returns {HTMLInputElement} The player name element.
   */
  generatePlayerName(isWhite) {
    const playerName = document.createElement("input");
    playerName.classList.add("chess-board__player-name");
    playerName.classList.add(
      isWhite
        ? "chess-board__player-name--white"
        : "chess-board__player-name--black"
    );
    playerName.value = isWhite ? "White" : "Black";
    return playerName;
  }

  /**
   * Renders the board along with the pieces.
   *
   * @returns {HTMLDivElement} The board element.
   */
  render() {
    const boardHtml = this.htmlElement;
    boardHtml.innerHTML = "";

    const playerNameBlack = this.generatePlayerName(false);
    boardHtml.appendChild(playerNameBlack);

    const boardContainer = this.generateBoardContainer();

    for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
      const rowHtml = this.generateRow();

      for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
        const square = this.gameState.getSquare(fileIndex, rankIndex);
        const squareHtml = square.getHtmlElement();

        this.initializeEventListnersForSquare(square);

        const piece = this.gameState.getPiece(fileIndex, rankIndex);

        if (piece) {
          square.setPiece(piece);
          piece.setControl(this.control);
        }

        rowHtml.appendChild(squareHtml);
      }

      boardContainer.appendChild(rowHtml);
    }

    boardHtml.appendChild(boardContainer);

    const playerNameWhite = this.generatePlayerName(true);
    boardHtml.appendChild(playerNameWhite);

    this.gameState.reEvaluateMoves(); // Evaluate moves for the first time
    checkIfKingIsInCheck(this.gameState, true);
    checkIfKingIsInCheck(this.gameState, false);

    return boardHtml;
  }
}
