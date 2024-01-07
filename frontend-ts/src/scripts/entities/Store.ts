/**
 * Returns the value of the item in local storage.
 *
 * @param key
 */
function getItem(key: string) {
  const value = localStorage.getItem(key);
  if (!value) return null;

  return JSON.parse(value);
}

/**
 * Sets the value of the item in local storage.
 *
 * @param key
 * @param value
 */
function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export class Store {
  player1Name: string;
  player2Name: string;

  constructor() {
    this.player1Name = getItem('player1Name') || 'White';
    this.player2Name = getItem('player2Name') || 'Black';
  }

  /**
   * Returns the player name.
   *
   * @param isPlayer1 Whether it is of player 1.
   *
   * @returns The player name.
   */
  getPlayerName(isPlayer1: boolean) {
    return isPlayer1 ? this.player1Name : this.player2Name;
  }

  /**
   * Changes the player name.
   *
   * @param isPlayer1 Whether it is for player 1.
   * @param newName The new name.
   */
  changePlayerName(isPlayer1: boolean, newName: string) {
    if (isPlayer1) {
      this.player1Name = newName;
      setItem('player1Name', newName);
    } else {
      this.player2Name = newName;
      setItem('player2Name', newName);
    }
  }
}
