export const registerRoute = {
  path: '/register',
  action: async () => {
    const { component } = await import('./register.component');
    return { component };
  },
};
