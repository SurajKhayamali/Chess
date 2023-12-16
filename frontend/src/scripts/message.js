function displayGameStatusText(text) {
  const message = document.querySelector(".game-info__status__text");
  message.innerText = text;
}

export function displayTurn(playerName) {
  displayGameStatusText(`${playerName}'s turn`);
}

export function displayDraw() {
  displayGameStatusText("Draw!");
}

export function displayCheckmate(winner) {
  displayGameStatusText(`${winner} wins!`);
}

export function displayResignation(winner) {
  displayGameStatusText(`${winner} wins by resignation!`);
}
