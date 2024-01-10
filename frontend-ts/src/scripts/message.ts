// const message = document.querySelector(
//   '#gameStatusText'
// ) as HTMLParagraphElement;

// import { message } from '../root.component';
import { message } from './main';

/**
 * Displays the given text in the game status text.
 *
 * @param {string} text The text to display.
 */
function displayGameStatusText(text: string) {
  message.innerText = text;
}

export function displayTurn(playerName: string) {
  displayGameStatusText(`${playerName}'s turn`);
}

export function displayDraw() {
  message.classList.add('text-secondary');
  displayGameStatusText('Draw!');
}

export function displayCheckmate(winner: string, loser: string) {
  message.classList.add('text-primary');
  displayGameStatusText(`${winner} wins by capturing ${loser}'s king!`);
}

export function displayResignation(winner: string) {
  message.classList.add('text-primary');
  displayGameStatusText(`${winner} wins by resignation!`);
}

export function displayWinByTime(winner: string) {
  message.classList.add('text-primary');
  displayGameStatusText(`${winner} wins by time!`);
}

export function clearStatusTextClasses() {
  message.classList.remove('text-primary');
  message.classList.remove('text-secondary');
}
