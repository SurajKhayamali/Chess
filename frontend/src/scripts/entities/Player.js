import { GameState } from "./GameState";
import { King } from "./components/pieces";

export class Player {
  /**
   * Creates a new player.
   *
   * @param {boolean} isWhite - Whether the player is white or black.
   * @param {GameState} state - The game state.
   * @param {boolean} isComputer - Whether the player is a computer or not.
   */
  constructor(isWhite, state, isComputer = false) {
    this.isWhite = isWhite;
    this.state = state;
    this.isComputer = isComputer;
  }

  /**
   * Returns whether it is the player's turn.
   *
   * @returns {boolean}
   */
  get isTurn() {
    return this.state.isWhitesTurn === this.isWhite;
  }

  /**
   * Returns the player's king.
   *
   * @returns {King}
   */
  get king() {
    return this.state
      .getPieces()
      .find((piece) => piece instanceof King && piece.isWhite === this.isWhite);
  }

  clone() {
    return new Player(this.isWhite, this.state, this.isComputer);
  }
}

export class ComputerPlayer extends Player {
  constructor(isWhite, state) {
    super(isWhite, state, true);
  }
}
