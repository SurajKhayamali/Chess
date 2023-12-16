import { GameState } from "./GameState";
import { King } from "./components/pieces";

export class Player {
  /**
   * Creates a new player.
   *
   * @param {string} name - The name of the player.
   * @param {boolean} isWhite - Whether the player is white or black.
   * @param {GameState} state - The game state.
   * @param {boolean} isComputer - Whether the player is a computer or not.
   */
  constructor(name, isWhite, state, isComputer = false) {
    this.name = name;
    this.isWhite = isWhite;
    this.state = state;
    this.isComputer = isComputer;

    this.king = this.state
      .getPieces()
      .find((piece) => piece instanceof King && piece.isWhite === this.isWhite);
  }

  /**
   * Returns whether it is the player's turn.
   *
   * @returns {boolean}
   */
  get isTurn() {
    return this.state.isWhitesTurn === this.isWhite;
  }
}

export class ComputerPlayer extends Player {
  constructor(name, isWhite, state) {
    super(name, isWhite, state, true);
  }
}
