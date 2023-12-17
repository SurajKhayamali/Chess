const message = document.querySelector(".game-info__status__text");

/**
 * Displays the given text in the game status text.
 *
 * @param {string} text The text to display.
 */
function displayGameStatusText(text) {
  message.innerText = text;
}

export function displayTurn(playerName) {
  displayGameStatusText(`${playerName}'s turn`);
}

export function displayDraw() {
  message.classList.add("game-info__status__text--draw");
  displayGameStatusText("Draw!");
}

export function displayCheckmate(winner, loser) {
  message.classList.add("game-info__status__text--winner");
  displayGameStatusText(`${winner} wins by capturing ${loser}'s king!`);
}

export function displayResignation(winner) {
  message.classList.add("game-info__status__text--winner");
  displayGameStatusText(`${winner} wins by resignation!`);
}

export function displayWinByTime(winner) {
  message.classList.add("game-info__status__text--winner");
  displayGameStatusText(`${winner} wins by time!`);
}
