import { IRoute } from 'interfaces/router.interface';

export const gamesRoute: IRoute = {
  path: '/games',
  children: [
    {
      path: '',
      action: async (context) => {
        console.log('game route', context);
        const { component, afterInitialize } = await import(
          './games.component'
        );
        return {
          component,
          afterInitialize,
          authRequired: true,
        };
      },
    },
    {
      path: '/:slug',
      action: async (context) => {
        const slug = context?.params.slug;
        if (!slug) return;

        const { component, afterInitialize } = await import(
          './gameDetail.component'
        );
        return {
          component,
          afterInitialize: () => afterInitialize(slug as string),
          // authRequired: true,
        };
      },
    },
  ],
};
