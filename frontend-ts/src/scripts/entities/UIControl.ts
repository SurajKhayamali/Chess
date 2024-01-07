import { AI_TYPE, DEFAULT_AI_TYPE, SELECTABLE_AI_TYPES } from '../ai';
import { Board } from '../components/Board';
import {
  displayDraw,
  displayResignation,
  displayTurn,
  displayWinByTime,
} from '../message';
// import { log } from "../utils";
import { Timer } from './Timer';

const DEFAULT_GAME_TIME_IN_SECONDS = 10 * 60;

export class UIControl {
  board: Board;
  gameStartSection: HTMLDivElement;
  playerVsPlayerModeForm: HTMLFormElement;
  playerVsComputerModeForm: HTMLFormElement;
  computerVsComputerModeForm: HTMLFormElement;
  aiTypeForPlayer1: NodeListOf<HTMLSelectElement>;
  aiTypeForPlayer2: NodeListOf<HTMLSelectElement>;
  // newGameInput: HTMLInputElement;
  gameInfoSection: HTMLDivElement;
  playersHtml: HTMLDivElement;
  playerNames: NodeListOf<HTMLParagraphElement>;
  playerTimes: NodeListOf<HTMLParagraphElement>;
  buttonsDuringGame: HTMLButtonElement;
  buttonsAfterGame: HTMLButtonElement;
  timeDuration: number;
  player1Timer: Timer;
  player2Timer: Timer;

  constructor(board: Board) {
    this.board = board;
    this.gameStartSection = document.querySelector(
      '.new-game'
    ) as HTMLDivElement;
    this.playerVsPlayerModeForm = document.querySelector(
      '.player-vs-player-mode-form'
    ) as HTMLFormElement;
    this.playerVsComputerModeForm = document.querySelector(
      '.player-vs-computer-mode-form'
    ) as HTMLFormElement;
    this.computerVsComputerModeForm = document.querySelector(
      '.computer-vs-computer-mode-form'
    ) as HTMLFormElement;
    this.aiTypeForPlayer1 = document.querySelectorAll('.ai-type-for-player-1');
    this.aiTypeForPlayer2 = document.querySelectorAll('.ai-type-for-player-2');
    // this.newGameInput = document.querySelector(".new-game__input");
    this.gameInfoSection = document.querySelector(
      '.game-info'
    ) as HTMLDivElement;
    this.playersHtml = document.querySelector(
      '.game-info__players'
    ) as HTMLDivElement;
    this.playerNames = document.querySelectorAll('.game-info__player-name');
    this.playerTimes = document.querySelectorAll('.game-info__player-time');
    this.buttonsDuringGame = document.querySelector(
      '.during-game'
    ) as HTMLButtonElement;
    this.buttonsAfterGame = document.querySelector(
      '.after-game'
    ) as HTMLButtonElement;

    this.timeDuration = DEFAULT_GAME_TIME_IN_SECONDS;

    this.player1Timer = new Timer(this.playerTimes[0], this.timeDuration);
    this.player2Timer = new Timer(this.playerTimes[1], this.timeDuration);

    this.fillOptionsForAiType();
    this.fillExistingNameOfPlayers();
    this.initializeEventListenerForPlayerVsPlayerModeForm();
    this.initializeEventListenerForPlayerVsComputerModeForm();
    this.initializeEventListenerForComputerVsComputerModeForm();
    this.initializeEventListenerForUndoButton();
    this.initializeEventListenerForDrawButton();
    this.initializeEventListenerForResignButton();
    this.initializeEventListenerForNewGameButton();
    this.initializeEventListenerForRestartButton();
    this.renderLoop();
  }

  /**
   * Returns the game state.
   *
   * @returns {GameState}
   */
  get gameState() {
    return this.board.gameState;
  }

  /**
   * Returns whether the timers should be activated.
   * The timers should be activated if the game is player vs player.
   * Otherwise, the timers should not be activated.
   *
   * @returns {boolean}
   */
  get shouldActivateTimers() {
    return this.gameState.isPlayerVsPlayer;
  }

  /**
   * Handles the game start.
   * The game is started.
   * The game start section is hidden and the game info section is shown.
   */
  handleGameStart() {
    this.gameState.startGame();

    this.gameStartSection.classList.add('hidden');

    this.gameInfoSection.classList.remove('hidden');
  }

  /**
   * Fill options for AI type
   */
  fillOptionsForAiType() {
    SELECTABLE_AI_TYPES.forEach((aiType) => {
      const option = document.createElement('option');
      option.value = aiType;
      option.textContent = aiType;

      if (aiType === DEFAULT_AI_TYPE) option.setAttribute('selected', 'true');

      this.aiTypeForPlayer1.forEach((aiTypeForPlayer1) => {
        aiTypeForPlayer1.appendChild(option.cloneNode(true));
      });
      this.aiTypeForPlayer2.forEach((aiTypeForPlayer2) => {
        aiTypeForPlayer2.appendChild(option.cloneNode(true));
      });
    });
  }

  /**
   * Fill existing name of players
   */
  fillExistingNameOfPlayers() {
    if (this.board.player1Name) {
      const player1NameInput = document.getElementById(
        'player1-name'
      ) as HTMLInputElement;
      player1NameInput.value = this.board.player1Name;
    }
    if (this.board.player2Name) {
      const player2NameInput = document.getElementById(
        'player2-name'
      ) as HTMLInputElement;
      player2NameInput.value = this.board.player2Name;
    }
  }

  /**
   * Initializes the event listener for the all mode game start buttons.
   */
  initializeEventListenerForPlayerVsPlayerModeForm() {
    this.playerVsPlayerModeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.playerVsPlayerModeForm);
      const selectedTime = formData.get('duration') as string;
      const player1Name = formData.get('player1-name') as string;
      const player2Name = formData.get('player2-name') as string;
      if (selectedTime) {
        this.timeDuration =
          parseInt(selectedTime) || DEFAULT_GAME_TIME_IN_SECONDS;
        this.player1Timer.updateInitialTime(this.timeDuration);
        this.player2Timer.updateInitialTime(this.timeDuration);
      }
      if (player1Name) {
        this.board.changePlayerName(true, player1Name);
      }
      if (player2Name) {
        this.board.changePlayerName(false, player2Name);
      }
      this.gameState.switchToPlayerVsPlayer();
      this.handleGameStart();
    });
  }

  initializeEventListenerForPlayerVsComputerModeForm() {
    this.playerVsComputerModeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.playerVsComputerModeForm);
      const aiTypeForPlayer2 = formData.get('aiTypeForPlayer2') as AI_TYPE;
      this.gameState.switchToPlayerVsComputer(aiTypeForPlayer2);
      this.handleGameStart();
    });
  }

  initializeEventListenerForComputerVsComputerModeForm() {
    this.computerVsComputerModeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(this.computerVsComputerModeForm);
      const aiTypeForPlayer1 = formData.get('aiTypeForPlayer1') as AI_TYPE;
      const aiTypeForPlayer2 = formData.get('aiTypeForPlayer2') as AI_TYPE;
      this.gameState.switchToComputerVsComputer(
        aiTypeForPlayer1,
        aiTypeForPlayer2
      );
      this.handleGameStart();
    });
  }

  /**
   * Initializes the event listener for the undo button.
   * When the button is clicked, the last move is undone.
   */
  initializeEventListenerForUndoButton() {
    const undoButton = document.querySelector(
      '.game-info__button--undo'
    ) as HTMLButtonElement;
    undoButton.addEventListener('click', () => {
      // log("Undo button clicked");
      this.gameState.undoLastMove();
    });
  }

  /**
   * Initializes the event listener for the draw button.
   * When the button is clicked, the game ends in a draw.
   */
  initializeEventListenerForDrawButton() {
    const drawButton = document.querySelector(
      '.game-info__button--draw'
    ) as HTMLButtonElement;
    drawButton.addEventListener('click', () => {
      if (this.gameState.hasGameEnded) return;

      this.gameState.endGame();
      displayDraw();
    });
  }

  /**
   * Initializes the event listener for the resign button.
   * When the button is clicked, the game ends in a resignation.
   * The player who clicked the button loses.
   * The other player wins.
   */
  initializeEventListenerForResignButton() {
    const resignButton = document.querySelector(
      '.game-info__button--resign'
    ) as HTMLButtonElement;
    resignButton.addEventListener('click', () => {
      // log("Resign button clicked");
      if (this.gameState.hasGameEnded) return;

      this.gameState.endGame(this.gameState.oponentPlayer);
      displayResignation(this.gameState.oponentPlayer.name);
    });
  }

  /**
   * Initializes the event listener for the new game button.
   * When the button is clicked, a new game is started.
   * The timers are reset.
   * The game start section is shown and the game info section is hidden.
   */
  initializeEventListenerForNewGameButton() {
    const newGameButton = document.querySelector(
      '.game-info__button--new'
    ) as HTMLButtonElement;
    newGameButton.addEventListener('click', () => {
      // log("New game button clicked");
      this.gameState.newGame();
      this.resetTimers();

      this.gameStartSection.classList.remove('hidden');
      this.gameInfoSection.classList.add('hidden');
    });
  }

  /**
   * Initializes the event listener for the restart button.
   * When the button is clicked, the game is restarted.
   * The timers are reset.
   */
  initializeEventListenerForRestartButton() {
    const restartButton = document.querySelector(
      '.game-info__button--restart'
    ) as HTMLButtonElement;
    restartButton.addEventListener('click', () => {
      // log("Restart button clicked");
      this.gameState.startGame();
      this.resetTimers();
    });
  }

  /**
   * Updates the player names.
   * The player names are updated based on the board state.
   */
  updatePlayerNames() {
    if (this.playerNames.length !== 2) return;
    this.playerNames[0].textContent = this.board.player1Name;
    this.playerNames[1].textContent = this.board.player2Name;
  }

  /**
   * Switches the timer.
   * The timer is switched based on player's turn switch.
   */
  switchTimer() {
    if (!this.shouldActivateTimers) return;

    if (this.gameState.isWhitesTurn) {
      this.player1Timer.start();
      this.player2Timer.stop();
    } else {
      this.player1Timer.stop();
      this.player2Timer.start();
    }
  }

  /**
   * Stops the current player's timer.
   */
  stopTimer() {
    if (!this.shouldActivateTimers) return;

    if (this.gameState.isWhitesTurn) {
      this.player1Timer.stop();
    } else {
      this.player2Timer.stop();
    }
  }

  /**
   * Resets the timers.
   * The timers are reset to their initial values.
   */
  resetTimers() {
    if (!this.shouldActivateTimers) return;

    this.player1Timer.reset();
    this.player2Timer.reset();
  }

  /**
   * Handles the time out.
   * If the time is out, the game ends.
   * The player who's time is out loses.
   * The other player wins.
   * The winner is displayed.
   * The timers are stopped.
   */
  handleTimeOut() {
    if (!this.shouldActivateTimers) return;

    if (this.player1Timer.time <= 0) {
      this.gameState.endGame(this.gameState.player2);
      displayWinByTime(this.gameState.player2.name);

      this.player1Timer.stop();
    } else if (this.player2Timer.time <= 0) {
      this.gameState.endGame(this.gameState.player1);
      displayWinByTime(this.gameState.player1.name);

      this.player2Timer.stop();
    }
  }

  /**
   * Hides the player times.
   */
  hidePlayerTimes() {
    for (const playerTime of this.playerTimes) {
      playerTime.classList.add('hidden');
    }
  }

  /**
   * Shows the player times.
   */
  showPlayerTimes() {
    for (const playerTime of this.playerTimes) {
      playerTime.classList.remove('hidden');
    }
  }

  /**
   * The render loop is used to update the UI on every frame.
   */
  renderLoop() {
    if (this.gameState.hasGameEnded) {
      this.buttonsDuringGame.classList.add('hidden');
      this.buttonsAfterGame.classList.remove('hidden');

      this.stopTimer();
    } else if (this.gameState.hasGameStarted) {
      this.buttonsDuringGame.classList.remove('hidden');
      this.buttonsAfterGame.classList.add('hidden');

      this.updatePlayerNames();
      displayTurn(this.gameState.currentPlayer.name);

      this.handleTimeOut();

      if (!this.shouldActivateTimers) {
        this.hidePlayerTimes();
      } else {
        this.showPlayerTimes();
      }

      if (!this.gameState.isWhitesTurn) {
        this.playersHtml.classList.add('game-info__players--reverse');

        if (this.shouldActivateTimers) {
          this.player1Timer.stop();
          this.player2Timer.start();
        }
      } else {
        this.playersHtml.classList.remove('game-info__players--reverse');

        if (this.shouldActivateTimers) {
          this.player2Timer.stop();
          this.player1Timer.start();
        }
      }
    }

    requestAnimationFrame(() => {
      this.renderLoop();
    });
  }
}
