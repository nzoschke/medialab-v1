importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js");

const { registerRoute } = workbox.routing;
const { CacheOnly } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { RangeRequestsPlugin } = workbox.rangeRequests;

const cacheProgress = new BroadcastChannel("CACHE_PROGRESS");

registerRoute(
  ({ request }) => {
    const { destination } = request;
    return destination === "video" || destination === "audio";
  },
  new CacheOnly({
    cacheName: "v1",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new RangeRequestsPlugin(),
    ],
  }),
);

/**
 * @param {MessageEvent} event
 * @return {PromiseLike<{ok: boolean, message: string}>}
 */
const cacheMedia = async (event) => {
  const { src, refresh } = event.data.payload;

  const cache = await caches.open("v1");

  if (!refresh && (await cache.match(src))) {
    cacheProgress.postMessage({
      progress: 1,
      src,
      type: "CACHE_PROGRESS",
    });

    return {
      ok: true,
      message: {
        status: 304,
        text: "cache.match",
      },
    };
  }

  const res = await fetch(src);
  streamProgress(res.clone(), async (progress) => {
    cacheProgress.postMessage({
      progress,
      src,
      type: "CACHE_PROGRESS",
    });
  });

  if (res.status == 200) {
    await cache.put(src, res);
    return {
      ok: true,
      message: {
        status: res.status,
        text: "cache.put",
      },
    };
  }

  return {
    ok: false,
    message: {
      status: res.status,
      text: await res.text(),
    },
  };
};

const getVersion = async (_) => {
  return VERSION;
};

self.addEventListener("message", async (event) => {
  const h = {
    CACHE_MEDIA: cacheMedia,
    GET_VERSION: getVersion,
  }[event.data.type];

  const msg = h ? await h(event) : `${event.data.type} handler not registered`;
  event.ports[0].postMessage(msg);
});

/**
 * @param {Response} res
 * @param {function(number): void} onProgress
 * @return {void}
 *
 * https://micahjon.com/2022/track-download-progress-workbox/
 */
const streamProgress = (res, onProgress) => {
  onProgress(0);

  let contentLength = 0;
  try {
    // Ensure that the browser supports ReadableStream and we know total file size
    if (!res.body) throw "response.body missing";

    // If content is encoded, then content-length will not be accurate
    if (res.headers.get("content-encoding")) throw "content-encoding header";

    // We use content-length header to get total file size
    const h = res.headers.get("content-length");
    if (h === null) throw "content-length missing";

    contentLength = parseInt(h);
  } catch (error) {
    console.error("Failed to track download progress", error);
    return;
  }

  let byteLength = 0;
  const reader = res.body.getReader();

  new ReadableStream({
    start(controller) {
      read();

      function read() {
        reader
          .read()
          .then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            controller.enqueue(value);
            byteLength += value.byteLength;
            onProgress(byteLength / contentLength);
            read();
          })
          .catch((error) => {
            // Error only typically occurs if network fails mid-download
            console.error("error in read()", error);
            controller.error(error);
          });
      }
    },

    // Firefox excutes this on page stop, Chrome does not
    cancel(reason) {
      console.log("cancel()", reason);
    },
  });
};
