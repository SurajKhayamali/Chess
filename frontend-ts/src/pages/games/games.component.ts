import { getUserInfo } from 'helpers/auth.helper';
import { getAllGames } from 'services/game.service';

export const component = /*html*/ `
  <div class="container">
    <h1 class="text-3xl font-bold">Games</h1>

    <div class="mt-4">
      <div class="mt-4">
        <table id="gamesListTable" class="table-auto">
          <thead>
            <tr>
              <th>ID</th>
              <th>White Player</th>
              <th>Black Player</th>
              <th>Mode</th>
              <th>Time Limit</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>

        <div id="noGamesFound" class="hidden">
          <p class="text-base font-semibold">No games found</p>
        </div>
  </div>
`;

const displayGameResult = (
  isOver?: boolean,
  hasWhitePlayerWon?: boolean,
  isPlayerWhite?: boolean
) => {
  return isOver
    ? hasWhitePlayerWon
      ? isPlayerWhite
        ? 'Won'
        : 'Lost'
      : isPlayerWhite
      ? 'Lost'
      : 'Won'
    : 'N/A';
};

export const afterInitialize = async () => {
  const gamesListTable = document.getElementById('gamesListTable');
  if (!gamesListTable) return;
  const tableBodyRef = gamesListTable.getElementsByTagName('tbody')[0];

  const noGamesFound = document.getElementById('noGamesFound');
  if (!noGamesFound) return;

  const games = await getAllGames();
  // console.log('games: ', games);

  if (!games.length) {
    noGamesFound.classList.remove('hidden');
    return;
  }

  const userId = getUserInfo()?.userId;

  for (const game of games) {
    const newRow = tableBodyRef.insertRow();
    newRow.classList.add('[&>*]:px-4');

    const idCell = newRow.insertCell(0);
    const whitePlayerCell = newRow.insertCell(1);
    const blackPlayerCell = newRow.insertCell(2);
    const modeCell = newRow.insertCell(3);
    const timeLimitCell = newRow.insertCell(4);
    const resultCell = newRow.insertCell(5);
    const actionsCell = newRow.insertCell(6);

    const {
      id,
      whitePlayer,
      blackPlayer,
      mode,
      timeLimit,
      isOver,
      hasWhitePlayerWon,
    } = game;

    const isCurrentPlayerWhite = whitePlayer
      ? whitePlayer.id === userId
      : false;

    idCell.innerText = String(id);
    whitePlayerCell.innerText = whitePlayer?.username || 'N/A';
    blackPlayerCell.innerText = blackPlayer?.username || 'N/A';
    if (isCurrentPlayerWhite) {
      whitePlayerCell.classList.add('font-bold');
      whitePlayerCell.innerText += ' (You)';
    } else {
      blackPlayerCell.classList.add('font-bold');
      blackPlayerCell.innerText += ' (You)';
    }
    modeCell.innerText = mode;
    timeLimitCell.innerText = String(timeLimit);
    resultCell.innerText = displayGameResult(
      isOver,
      hasWhitePlayerWon,
      isCurrentPlayerWhite
    );
    actionsCell.innerHTML = /*html*/ `
      <a href="/games/${game.slug}" class="btn btn-ghost">${
      isOver ? 'View' : 'Play'
    }</a>
    `;
  }
};
