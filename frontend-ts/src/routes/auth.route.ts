import { renderRegister, renderLogin } from '../controllers/auth.controller';

export const authRoutes = [
  {
    path: '/register',
    action: renderRegister,
  },
  {
    path: '/login',
    action: renderLogin,
  },
];
