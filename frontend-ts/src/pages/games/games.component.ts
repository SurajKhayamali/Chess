export const renderGames = () => /*html*/ `
  <div class="container">
    <div class="card bg-base-300">
      <div class="card-body">
        <div class="flex flex-col items-center">
          <p class="text-2xl">Past Games</p>
        </div>
      </div>
    </div>
  </div>
`;

export const renderGame = (slug: string) => /*html*/ `
	<div class="card bg-base-300">
		<div class="card-body">
			<div class="flex flex-col items-center">
				<p class="text-2xl">Game Started! ${slug}</p>
				<div class="spinner w-32 h-32 mt-4"></div>
			</div>
		</div>
	</div>
`;
