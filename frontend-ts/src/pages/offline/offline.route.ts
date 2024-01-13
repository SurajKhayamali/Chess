export const offlineRoute = {
  path: '/offline',
  action: async () => {
    const { component, afterInitialize } = await import('./offline.component');
    return { component, afterInitialize };
  },
};
