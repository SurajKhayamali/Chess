export const registerRoute = {
  path: '/register',
  action: async () => {
    const { component, afterInitialize } = await import('./register.component');
    return { component, afterInitialize, authRequired: false };
  },
};
