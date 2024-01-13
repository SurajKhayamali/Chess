import { loggedInOnlyGuard } from 'helpers/auth.helper';
import { IRoute } from 'interfaces/router.interface';

export const homeRoute: IRoute = {
  path: '/',
  action: async () => {
    loggedInOnlyGuard();
    const { component, afterInitialize } = await import('./home.component');
    return { component, afterInitialize };
  },
};
