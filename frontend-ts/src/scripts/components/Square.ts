import { SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS } from '../constants/game.constant';
import { getSquareColor, getSquareId } from '../utils';
import { SquareHighlightModifiers } from '../enums/game.enum';
import { Piece } from './pieces/Piece';

export class Square {
  fileIndex: number;
  rankIndex: number;
  piece: Piece | null;
  htmlElement: HTMLDivElement;

  /**
   * Creates a new square.
   *
   * @param {number} fileIndex The file index of the square.
   * @param {number} rankIndex The rank index of the square.
   * @param {Piece?} piece The piece on the square.
   */
  constructor(
    fileIndex: number,
    rankIndex: number,
    piece: Piece | null = null
  ) {
    this.fileIndex = fileIndex;
    this.rankIndex = rankIndex;
    this.piece = piece;

    this.htmlElement = this.generateHtmlElement();
  }

  /**
   * Generates the square's HTML element.
   */
  generateHtmlElement() {
    if (this.htmlElement) return this.htmlElement;

    const squareId = getSquareId(this.fileIndex, this.rankIndex);

    const square = document.createElement('div');

    square.classList.add('chess-board__square');
    square.classList.add(
      `chess-board__square--${getSquareColor(this.fileIndex, this.rankIndex)}`
    );
    square.setAttribute('data-square', squareId);

    return square;
  }

  /**
   * Returns the square's HTML element.
   */
  getHtmlElement() {
    return this.htmlElement;
  }

  /**
   * Highlights a square on the board.
   *
   * @param modifier The modifier to add to the class name.
   */
  highlight(modifier: SquareHighlightModifiers) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.add(`chess-board__square--${modifier}`);
  }

  /**
   * Removes a highlight styling from a square on the board.
   *
   * @param modifier The modifier to add to the class name.
   */
  removeHighlight(modifier: SquareHighlightModifiers) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.remove(`chess-board__square--${modifier}`);
  }

  /**
   * Sets the piece on the square.
   *
   * @param piece The piece to set on the square.
   */
  setPiece(piece: Piece) {
    if (!piece) {
      this.htmlElement.innerHTML = '';
      return;
    }

    this.piece = piece;
    this.htmlElement.appendChild(piece.getHtmlElement());
  }

  /**
   * Removes the piece from the square.
   */
  removePiece() {
    this.piece = null;
    this.htmlElement.innerHTML = '';
  }
}
