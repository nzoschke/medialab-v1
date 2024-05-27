export const Cache = async (src: string) => {
  const { Workbox } = await import("workbox-window");

  const wb = new Workbox("/sw.js");
  await wb.register();

  await wb.messageSW({
    payload: {
      src,
    },
    type: "CACHE_MEDIA",
  });
};
