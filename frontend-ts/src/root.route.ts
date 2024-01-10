import { renderNavComponent } from 'components/navbar/navbar.component';
import { checkIfAuthenticated } from 'scripts/helpers/auth.helper';
import { IRoute } from 'scripts/interfaces/router.interface';

export const rootRoute: IRoute = {
  path: '/',
  action: async () => {
    // console.log('root route');
    const { component, loadScripts, afterInitialize } = await import(
      './root.component'
    );

    const authContext = await checkIfAuthenticated();
    renderNavComponent(authContext);
    return { component, loadScripts, afterInitialize };
  },
};
