import { loggedInOnlyGuard } from 'helpers/auth.helper';
import { IRoute } from 'interfaces/router.interface';

export const messagesRoute: IRoute = {
  path: '/messages',
  action: async () => {
    loggedInOnlyGuard();
    const { component, afterInitialize } = await import('./messages.component');
    return { component, afterInitialize };
  },
};
