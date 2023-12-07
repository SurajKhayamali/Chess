import { SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS } from "../constants";
import { getSquareColor, getSquareId } from "../utils";

export class Square {
  constructor(fileIndex, rankIndex) {
    this.fileIndex = fileIndex;
    this.rankIndex = rankIndex;

    this.htmlElement = this.generateHtmlElement();
  }

  /**
   * Generates the square's HTML element.
   *
   * @returns {HTMLDivElement}
   */
  generateHtmlElement() {
    if (this.htmlElement) return this.htmlElement;

    const squareId = getSquareId(this.fileIndex, this.rankIndex);

    const square = document.createElement("div");

    square.classList.add("chess-board__square");
    square.classList.add(
      `chess-board__square--${getSquareColor(this.fileIndex, this.rankIndex)}`
    );
    square.setAttribute("data-square", squareId);

    return square;
  }

  /**
   * Returns the square's HTML element.
   *
   * @returns {HTMLDivElement}
   */
  getHtmlElement() {
    return this.htmlElement;
  }

  /**
   * Highlights a square on the board.
   *
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
   */
  highlight(modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.add(`chess-board__square--${modifier}`);
  }

  /**
   * Removes a highlight styling from a square on the board.
   *
   * @param {"selected" | "valid" | "hover"} modifier The modifier to add to the class name.
   */
  removeHighlight(modifier) {
    if (!SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS.includes(modifier)) return;

    this.htmlElement.classList.remove(`chess-board__square--${modifier}`);
    // for (const modifier of SUPPORTED_SQUARE_HIGILIGHT_MODIFIERS) {
    //   this.htmlElement.classList.remove(`chess-board__square--${modifier}`);
    // }
  }
}
