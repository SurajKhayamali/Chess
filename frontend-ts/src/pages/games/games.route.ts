import { IRoute } from 'interfaces/router.interface';

export const gamesRoute: IRoute = {
  path: '/games',
  children: [
    {
      path: '',
      action: async (context) => {
        console.log('game route', context);
        const { renderGames } = await import('./games.component');
        return { component: renderGames(), authRequired: true };
      },
    },
    {
      path: '/:slug',
      action: async (context) => {
        const slug = context?.params.slug;
        if (!slug) return;

        const { renderGame, afterInitializeGame } = await import(
          './games.component'
        );
        return {
          component: renderGame(),
          afterInitialize: () => afterInitializeGame(slug as string),
          authRequired: true,
        };
      },
    },
  ],
};
