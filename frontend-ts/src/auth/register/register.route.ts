export const registerRoute = {
  path: '/register',
  action: async () => {
    const { component, loadScripts, afterInitialize } = await import(
      './register.component'
    );
    return { component, loadScripts, afterInitialize };
  },
};
