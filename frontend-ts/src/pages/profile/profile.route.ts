export const profileRoute = {
  path: '/profile',
  action: async () => {
    const { component, afterInitialize } = await import('./profile.component');
    return { component, afterInitialize };
  },
};
