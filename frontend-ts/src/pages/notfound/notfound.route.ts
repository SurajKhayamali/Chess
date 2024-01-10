import { IRoute } from 'interfaces/router.interface';

export const notFoundRoute: IRoute = {
  path: '(.*)',
  action: async () => {
    const { component, afterInitialize } = await import('./notfound.component');

    return { component, afterInitialize };
  },
};
