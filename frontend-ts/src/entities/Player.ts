import { checkIfSameColor } from 'scripts/utils';
import { GameState } from './GameState';
import { King } from 'components/pieces';
import { AI_TYPE, DEFAULT_AI_TYPE } from 'scripts/ai';

export class Player {
  name: string;
  isWhite: boolean;
  state: GameState;
  isComputer: boolean;
  aiType: AI_TYPE | null;
  king: King;

  /**
   * Creates a new player.
   *
   * @param name - The name of the player.
   * @param isWhite - Whether the player is white or black.
   * @param state - The game state.
   * @param isComputer - Whether the player is a computer or not.
   */
  constructor(
    name: string,
    isWhite: boolean,
    state: GameState,
    isComputer = false
  ) {
    this.name = name;
    this.isWhite = isWhite;
    this.state = state;
    this.isComputer = isComputer;
    this.aiType = isComputer ? DEFAULT_AI_TYPE : null;

    this.king = this.state
      .getPieces()
      .find(
        (piece) =>
          piece instanceof King && checkIfSameColor(piece.isWhite, this.isWhite)
      ) as King;
  }

  /**
   * Returns whether it is the player's turn.
   */
  get isTurn() {
    return checkIfSameColor(this.state.isWhitesTurn, this.isWhite);
  }

  /**
   * Updates the player's name.
   *
   * @param name Player's name
   */
  updateName(name: string) {
    this.name = name;
  }

  /**
   * Switches the player to computer.
   *
   * @param aiType AI type
   */
  switchToComputer(aiType: AI_TYPE) {
    this.isComputer = true;
    this.aiType = aiType;
  }

  /**
   * Switches the player to human.
   */
  switchToPlayer() {
    this.isComputer = false;
    this.aiType = null;
  }
}

export class ComputerPlayer extends Player {
  constructor(name: string, isWhite: boolean, state: GameState) {
    super(name, isWhite, state, true);
  }
}
