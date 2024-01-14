import { IRoute } from 'interfaces/router.interface';

export const homeRoute: IRoute = {
  path: '/',
  action: async () => {
    const { component, afterInitialize } = await import('./home.component');
    return { component, afterInitialize, authRequired: true };
  },
};
