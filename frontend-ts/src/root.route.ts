import { IRoute } from 'scripts/interfaces/router.interface';

export const rootRoute: IRoute = {
  path: '/',
  action: async () => {
    // console.log('root route');
    const { component, loadScripts, afterInitialize } = await import(
      './root.component'
    );
    return { component, loadScripts, afterInitialize };
  },
};
