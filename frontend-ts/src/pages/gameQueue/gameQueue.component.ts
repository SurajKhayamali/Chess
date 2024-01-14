import { TIME_VARIANTS } from 'constants/game.constant';
import { SocketEvent } from 'enums/socket.enum';
import { emit } from 'helpers/socket.helper';
import { Game } from 'interfaces/game.interface';
import { handleNavigation } from 'scripts/router';
import { socket } from 'scripts/socket';

const getTimeVaraintByTimeLimit = (timeLimit: number) =>
  TIME_VARIANTS.find((timeVariant) => timeVariant.value === timeLimit);

export const renderGameQueue = (timeLimit: number) => {
  const timeVariant = getTimeVaraintByTimeLimit(timeLimit);

  return /*html*/ `
	<div class="card bg-base-300">
		<div class="card-body">
		<div class="flex flex-col items-center">
      <p class="text-2xl">Game Queue for mode:  ${timeVariant?.title} (${timeVariant?.description})</p>
			<div class="spinne mt-4"><span class="loading loading-dots loading-lg"></span></div>
      <p class="text-xl mt-4">Waiting for opponent...</p>
      <button id="cancelQueueBtn" class="btn btn-ghost mt-4">Cancel</button>
		</div>
		</div>
	</div>
`;
};

export const afterInitialize = async (timeLimit: number) => {
  // Mocking a 3 second wait time before the game starts
  // setTimeout(() => {
  //   handleNavigation('/games/1');
  // }, 3000);
  const res = await emit(socket, SocketEvent.GAME_JOIN_QUEUE, {
    timeLimit: timeLimit,
  });
  const slug = (res as Game)?.slug;
  if (slug) {
    handleNavigation(`/games/${slug}`);
  }

  const cancelQueueBtn = document.getElementById('cancelQueueBtn');
  cancelQueueBtn?.addEventListener('click', async () => {
    await emit(socket, SocketEvent.GAME_LEAVE_QUEUE, {
      timeLimit: timeLimit,
    });
    handleNavigation('/');
  });

  socket.on(SocketEvent.GAME_STARTED, (game: Game) => {
    handleNavigation(`/games/${game.slug}`);
  });
};
