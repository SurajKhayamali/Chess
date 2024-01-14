import { IRoute } from 'interfaces/router.interface';

export const gameQueueRoute: IRoute = {
  path: '/gameQueue/:timeLimit',
  action: async (context) => {
    const timeLimit = Number(context?.params.timeLimit) || 0;

    const { renderGameQueue, afterInitialize } = await import(
      './gameQueue.component'
    );
    return {
      component: renderGameQueue(timeLimit),
      afterInitialize,
      authRequired: true,
    };
  },
};
