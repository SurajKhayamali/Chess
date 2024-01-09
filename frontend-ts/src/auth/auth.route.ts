import { IRoute } from 'scripts/interfaces/router.interface';
import { loginRoute } from './login/login.route';
import { registerRoute } from './register/register.route';

export const authRoute: IRoute = {
  path: '/auth',
  children: [loginRoute, registerRoute],
};
