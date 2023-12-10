export class Player {
  /**
   * Creates a new player.
   *
   * @param {boolean} isWhite - Whether the player is white or black.
   * @param {boolean} isComputer - Whether the player is a computer or not.
   */
  constructor(isWhite, isComputer = false) {
    this.isWhite = isWhite;
    this.isComputer = isComputer;
  }
}

export class ComputerPlayer extends Player {
  constructor(isWhite) {
    super(isWhite, true);
  }
}
