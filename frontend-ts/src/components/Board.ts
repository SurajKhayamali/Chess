import { FILES_LENGTH, RANKS_LENGTH } from 'constants/game.constant';
import { GameControl } from 'entities/GameControl';
import { GameState } from 'entities/GameState';
import { Store } from 'entities/Store';
import { UIControl } from 'entities/UIControl';
import { SquareHighlightModifiers } from 'enums/game.enum';
import { Piece } from './pieces';
import { Square } from './Square';
import { checkIfKingIsInCheck } from './pieces/helpers/kingInCheck.helper';

export class Board {
  boardId: string;
  htmlElement: HTMLDivElement;
  store: Store;
  player1Name: string;
  player2Name: string;
  gameState: GameState;
  control: GameControl;
  uiContorl: UIControl;
  playerNameBlack: HTMLInputElement;
  playerNameWhite: HTMLInputElement;

  /**
   * Creates a new board.
   *
   * @param boardId The id of the HTML element that will contain the board.
   * @param initialState The initial state of the board.
   * @param isWhitesTurn Whether it is white's turn.
   */
  constructor(boardId: string, initialState: Piece[][], isWhitesTurn = true) {
    this.boardId = boardId;
    this.htmlElement = document.getElementById(boardId) as HTMLDivElement;
    if (!this.htmlElement)
      throw new Error(`Element with id ${boardId} not found`);

    this.store = new Store();

    this.player1Name = this.store.getPlayerName(true);
    this.player2Name = this.store.getPlayerName(false);

    this.gameState = new GameState(
      initialState,
      this.player1Name,
      this.player2Name,
      isWhitesTurn
    );
    this.control = new GameControl(this.htmlElement, this.gameState);
    this.uiContorl = new UIControl(this);

    this.gameState.setControl(this.control);

    this.playerNameBlack = this.generatePlayerName(false);
    this.playerNameWhite = this.generatePlayerName(true);

    this.renderLoop();
  }

  /**
   * fixes the board orientation.
   */
  fixOrientation() {
    this.control.fixBoardOrientation();
  }

  /**
   * Initializes event listeners for a square.
   *
   * @param {Square} square The square to initialize event listeners for.
   */
  initializeEventListnersForSquare(square: Square) {
    const squareElement = square.getHtmlElement();

    squareElement.addEventListener('dragenter', () => {
      if (
        !this.control.isSquareHighlighted(
          square,
          SquareHighlightModifiers.VALID
        )
      )
        return;

      square.highlight(SquareHighlightModifiers.HOVER);
    });
    squareElement.addEventListener('dragleave', () => {
      if (
        !this.control.isSquareHighlighted(
          square,
          SquareHighlightModifiers.VALID
        )
      )
        return;

      square.removeHighlight(SquareHighlightModifiers.HOVER);
    });
    squareElement.addEventListener('drop', () => {
      const { fileIndex, rankIndex } = square;
      this.control.handleMoveSelectedPieceTo(fileIndex, rankIndex);

      square.removeHighlight(SquareHighlightModifiers.HOVER);
    });
    squareElement.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    squareElement.addEventListener('click', () => {
      const { fileIndex, rankIndex } = square;
      this.control.handleMoveSelectedPieceTo(fileIndex, rankIndex);

      square.removeHighlight(SquareHighlightModifiers.HOVER);
    });
  }

  /**
   * Generates the board container.
   *
   * @returns {HTMLDivElement} The board container element.
   */
  generateBoardContainer() {
    const boardContainer = document.createElement('div');
    boardContainer.classList.add('chess-board__board-container');
    return boardContainer;
  }

  /**
   * Generates a row for the chess board.
   *
   * @returns {HTMLDivElement} The row element.
   */
  generateRow() {
    const row = document.createElement('div');
    row.classList.add('chess-board__row');
    return row;
  }

  /**
   * Generates a player name element.
   * @param isWhite Whether the player is white.
   *
   * @returns {HTMLInputElement} The player name element.
   */
  generatePlayerName(isWhite: boolean) {
    const playerName = document.createElement('input');
    playerName.classList.add('chess-board__player-name');
    playerName.classList.add(
      isWhite
        ? 'chess-board__player-name--white'
        : 'chess-board__player-name--black'
    );
    playerName.value = isWhite ? this.player1Name : this.player2Name;

    playerName.addEventListener('change', (event) => {
      this.changePlayerName(isWhite, (event.target as HTMLInputElement).value);
    });

    return playerName;
  }

  /**
   * Changes the name of the player.
   * @param {boolean} isWhite Whether the player is white.
   * @param {string} newName The new name of the player.
   */
  changePlayerName(isWhite: boolean, newName: string) {
    if (isWhite) {
      this.player1Name = newName;
      this.gameState.player1.updateName(newName);
      this.playerNameWhite.value = newName;
    } else {
      this.player2Name = newName;
      this.gameState.player2.updateName(newName);
      this.playerNameBlack.value = newName;
    }
    this.store.changePlayerName(isWhite, newName);
  }

  /**
   * Re-evaluates the game state.
   */
  reEvaluateGameState() {
    this.gameState.reEvaluateMoves(); // Evaluate moves for the first time
    checkIfKingIsInCheck(this.gameState, true);
    checkIfKingIsInCheck(this.gameState, false);
  }

  /**
   * Renders the board along with the pieces.
   *
   * @returns {HTMLDivElement} The board element.
   */
  render() {
    const boardHtml = this.htmlElement;
    boardHtml.innerHTML = '';

    boardHtml.appendChild(this.playerNameBlack);

    const boardContainer = this.generateBoardContainer();

    for (let rankIndex = RANKS_LENGTH - 1; rankIndex >= 0; rankIndex--) {
      const rowHtml = this.generateRow();

      for (let fileIndex = 0; fileIndex < FILES_LENGTH; fileIndex++) {
        const square = this.gameState.getSquare(fileIndex, rankIndex);
        if (!square)
          throw new Error(`Square not found at ${fileIndex}, ${rankIndex}`);
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

    boardHtml.appendChild(this.playerNameWhite);

    return boardHtml;
  }

  /**
   * The render loop is used to update the UI on every frame.
   */
  renderLoop() {
    if (this.gameState.hasGameStarted) {
      this.fixOrientation();
    }

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
