import { RouterContext } from 'universal-router';
import { homeRoute } from './home.route';
import { authRoutes } from './auth.route';
import { accountRoute } from './account.route';

export const routes: RouterContext = [
  homeRoute,
  ...authRoutes,
  accountRoute,
  {
    path: '(.*)', // optional, matches /anything (lazy match)
    action: () => '<h1>Page not found</h1>',
  },
];
