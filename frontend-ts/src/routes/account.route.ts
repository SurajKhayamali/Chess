import {
  renderAccount,
  renderEditAccount,
} from '../controllers/account.controller';

export const accountRoute = {
  path: '/account',
  action: () => console.log('checking child routes for /account'),
  children: [
    {
      path: '',
      action: renderAccount,
    },
    {
      path: '/edit',
      action: renderEditAccount,
    },
  ],
};
