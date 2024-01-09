import { IRoute } from 'scripts/interfaces/router.interface';

export const rootRoute: IRoute = {
  path: '/',
  action: async () => {
    const { component, loadScripts } = await import('./root.component');
    return { component, loadScripts };
  },
};
