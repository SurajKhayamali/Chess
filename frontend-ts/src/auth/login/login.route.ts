import { IRoute } from 'scripts/interfaces/router.interface';

export const loginRoute: IRoute = {
  path: '/login',
  action: async () => {
    const { component } = await import('./login.component');

    return { component };
  },
};
