/**
 * Returns the value of the item in local storage.
 *
 * @param {string} key
 *
 * @returns {any}
 */
function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Sets the value of the item in local storage.
 *
 * @param {string} key
 * @param {any} value
 */
function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export class Store {
  constructor() {
    this.player1Name = getItem("player1Name") || "White";
    this.player2Name = getItem("player2Name") || "Black";
  }

  /**
   * Returns the player name.
   *
   * @param {boolean} isPlayer1 Whether it is of player 1.
   *
   * @returns {string} The player name.
   */
  getPlayerName(isPlayer1) {
    return isPlayer1 ? this.player1Name : this.player2Name;
  }

  /**
   * Changes the player name.
   *
   * @param {boolean} isPlayer1 Whether it is for player 1.
   * @param {string} newName The new name.
   */
  changePlayerName(isPlayer1, newName) {
    if (isPlayer1) {
      this.player1Name = newName;
      setItem("player1Name", newName);
    } else {
      this.player2Name = newName;
      setItem("player2Name", newName);
    }
  }
}
