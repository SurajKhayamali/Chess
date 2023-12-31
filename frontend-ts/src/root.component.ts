export const component = `
<div class="container main">
      <section class="chess-board">
        <div id="board" class="chess-board__container">
        </div>
      </section>
      <section class="new-game">
        <h2 class="new-game__title">Play a New Game</h2>
        <form class="player-vs-player-mode-form">
          <div class="form-group">
            <label for="player1-name">Player/Computer 1's Name</label>
            <input type="text" id="player1-name" name="player1-name" class="new-game__input"
              placeholder="Enter player/computer 1's name">
          </div>
          <div class="form-group">
            <label for="player2-name">Player/Computer 2's Name</label>
            <input type="text" id="player2-name" name="player2-name" class="new-game__input"
              placeholder="Enter player/computer 2's name">
          </div>

          <div class="form-group">
            <label for="duration">Duration</label>
            <select id="duration" name="duration" class="new-game__input">
              <option value="60">1 min</option>
              <option value="180">3 min</option>
              <option value="300">5 min</option>
              <option value="600" selected>10 min</option>
              <option value="1800">30 min</option>
            </select>
          </div>

          <button type="submit" class="new-game__button new-player-vs-player"
            title="Play with another player on the same screen turn by turn">New Game
            (Player vs Player)</button>
        </form>
        <form class="player-vs-computer-mode-form">
          <div class="form-group">
            <label for="aiTypeForPlayer2">AI Type (Computer 2)</label>
            <select id="aiTypeForPlayer2" name="aiTypeForPlayer2" class="new-game__input ai-type-for-player-2">
            </select>
          </div>

          <button type="submit" class="new-game__button new-player-vs-computer"
            title="Play with Computerof your choice">New
            Game (Player vs
            Computer)</button>
        </form>
        <form class="computer-vs-computer-mode-form">
          <div class="form-group">
            <label for="aiTypeForPlayer1">AI Type (Computer 1)</label>
            <select id="aiTypeForPlayer1" name="aiTypeForPlayer1" class="new-game__input ai-type-for-player-1">
            </select>
          </div>
          <div class="form-group">
            <label for="aiTypeForPlayer2">AI Type (Computer 2)</label>
            <select id="aiTypeForPlayer2" name="aiTypeForPlayer2" class="new-game__input ai-type-for-player-2">
            </select>
          </div>
          <button type="submit" class="new-game__button new-computer-vs-computer"
            title="Watch Computer play against itself">New
            Game (Computer vs Computer)</button>
        </form>
      </section>
      <section class="game-info hidden">
        <div class="game-info__players">
          <div class="game-info__player">
            <p class="game-info__player-name">Player 1</p>
            <p class="game-info__player-time">10:00</p>
          </div>
          <div class="game-info__player">
            <p class="game-info__player-name">Player 2</p>
            <p class="game-info__player-time">10:00</p>
          </div>
        </div>

        <div class="game-info__status">
          <p class="game-info__status__text">Player 1 turn</p>
        </div>

        <div class="game-info__buttons during-game">
          <button class="game-info__button game-info__button--undo"><i class="fa-solid fa-backward"></i>
            <span>Undo</span></button>
          <button class="game-info__button game-info__button--draw"><i
              class="fa-solid fa-handshake"></i><span>Draw</span></button>
          <button class="game-info__button game-info__button--resign"><i
              class="fa-solid fa-flag"></i><span>Resign</span></button>
        </div>

        <div class="game-info__buttons after-game hidden">
          <button class="game-info__button game-info__button--new"><i class="fa-solid fa-plus"></i>
            <span>New Game</span></button>
          <button class="game-info__button game-info__button--restart"><i
              class="fa-solid fa-rotate-left"></i></i><span>Rematch</span></button>
        </div>

        <table class="game-info__history hidden">
          <thead>
            <tr>
              <th>Move</th>
              <th>White</th>
              <th>Black</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>

        <div class="game-info__buttons hidden">
          <i class="fa-solid fa-backward-fast"></i>
          <i class="fa-solid fa-backward-step"></i>
          <i class="fa-solid fa-forward-step"></i>
          <i class="fa-solid fa-forward-fast"></i>
        </div>
      </section>
    </div>
`;

export const loadScripts = () => {
  const script = document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', '/scripts/main.ts');

  script.onload = () => {
    console.log('loaded');
  };

  return script;
};
