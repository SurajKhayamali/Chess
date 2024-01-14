import { handleNavigation } from 'scripts/router';

export const renderGameQueue = (timeLimit: number) => /*html*/ `
	<div class="card bg-base-300">
		<div class="card-body">
		<div class="flex flex-col items-center">
            <p class="text-2xl">Game Queue for mode with ${timeLimit}</p>
			<div class="spinner w-32 h-32 mt-4"></div>
		</div>
		</div>
	</div>
`;

export const afterInitialize = () => {
  // Mocking a 3 second wait time before the game starts
  setTimeout(() => {
    handleNavigation('/games/1');
  }, 3000);

  // TODO: Communicate with backend using socket.io to handle game queue
};
