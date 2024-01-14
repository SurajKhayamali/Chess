import { IRoute } from 'interfaces/router.interface';

export const loginRoute: IRoute = {
  path: '/login',
  action: async () => {
    const { component, afterInitialize } = await import('./login.component');

    return { component, afterInitialize, authRequired: false };
  },
};
