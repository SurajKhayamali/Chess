import { loggedInOnlyGuard } from 'helpers/auth.helper';

export const profileRoute = {
  path: '/profile',
  action: async () => {
    loggedInOnlyGuard();
    const { component, afterInitialize } = await import('./profile.component');
    return { component, afterInitialize };
  },
};
