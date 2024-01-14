import { IRoute } from 'interfaces/router.interface';

export const messagesRoute: IRoute = {
  path: '/messages',
  action: async () => {
    const { component, afterInitialize } = await import('./messages.component');
    return { component, afterInitialize, authRequired: true };
  },
};
