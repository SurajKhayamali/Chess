import { IRoute } from 'interfaces/router.interface';
import { loginRoute } from './login/login.route';
import { registerRoute } from './register/register.route';
import { loggedOutOnlyGuard } from 'helpers/auth.helper';

export const authRoute: IRoute = {
  path: '/auth',
  action: async () => {
    loggedOutOnlyGuard();
  },
  children: [loginRoute, registerRoute],
};
