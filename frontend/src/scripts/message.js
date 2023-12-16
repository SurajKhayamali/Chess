const message = document.querySelector(".game-info__status__text");

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

export function displayCheckmate(winner) {
  message.classList.add("game-info__status__text--winner");
  displayGameStatusText(`${winner} wins!`);
}

export function displayResignation(winner) {
  message.classList.add("game-info__status__text--winner");
  displayGameStatusText(`${winner} wins by resignation!`);
}
