function getItem(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export class Store {
  constructor() {
    this.player1Name = getItem("player1Name") || "White";
    this.player2Name = getItem("player2Name") || "Black";
  }

  getPlayerName(isPlayer1) {
    return isPlayer1 ? this.player1Name : this.player2Name;
  }

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
