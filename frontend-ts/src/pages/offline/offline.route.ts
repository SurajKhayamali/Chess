export const offlineRoute = {
  path: '/offline',
  action: async () => {
    const { component, loadScripts, afterInitialize } = await import(
      './offline.component'
    );
    return { component, loadScripts, afterInitialize };
  },
};
