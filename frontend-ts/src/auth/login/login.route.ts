import { IRoute } from 'scripts/interfaces/router.interface';

export const loginRoute: IRoute = {
  path: '/login',
  action: async () => {
    const { component, loadScripts, afterInitialize } = await import(
      './login.component'
    );

    return { component, loadScripts, afterInitialize };
  },
};
