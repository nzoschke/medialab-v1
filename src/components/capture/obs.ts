import OBSWebSocket from "obs-websocket-js";

export const Recorder = () => {
  const obs = new OBSWebSocket();

  const init = async (url?: string, password?: string) => {
    await obs.connect(url, password);
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
