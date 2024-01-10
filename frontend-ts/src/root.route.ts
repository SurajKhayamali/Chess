import { checkIfAuthenticated } from 'scripts/helpers/auth.helper';
import { IRoute } from 'scripts/interfaces/router.interface';

export const rootRoute: IRoute = {
  path: '/',
  action: async (context) => {
    // console.log('root route');
    const { component, loadScripts, afterInitialize } = await import(
      './root.component'
    );

    const authContext = await checkIfAuthenticated();
    console.log(context, authContext);
    return { component, loadScripts, afterInitialize };
  },
};
