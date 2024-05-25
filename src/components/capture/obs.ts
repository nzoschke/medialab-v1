import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";

export const Recorder = (opts?: { onInit?: (ok: boolean) => void; onLog?: (msg: string) => void }) => {
  const obs = new OBSWebSocket();

  const _log = (msg: string) => {
    if (opts?.onLog) return opts.onLog(msg);
    console.log(msg);
  };

  const init = async (url?: string, password?: string) => {
    try {
      const { rpcVersion } = await obs.connect(url, password);
      opts?.onInit && opts.onInit(true);
      _log(`connect rpcVersion=${rpcVersion}`);
    } catch (e) {
      if (e instanceof OBSWebSocketError) {
        opts?.onInit && opts.onInit(false);
        _log(`connect error ${e.message} ${e.code}`);
      }
    }
  };

  const start = async () => {
    // https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#startrecord
    await obs.call("StartRecord");
  };

  const stop = async () => {
    // https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#startrecord
    const { outputPath } = await obs.call("StopRecord");
    return outputPath;
  };

  return {
    init,
    start,
    stop,
  };
};
