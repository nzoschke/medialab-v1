import { Cache } from "@components/worker";

export interface Device {
  context: AudioContext;
  node: AudioNode;
  label: String;
}

export interface DeviceElement {
  context: AudioContext;
  el: HTMLAudioElement;
  node: AudioNode;
  label: String;
  pauseResume: () => void;
  progress: (p: number) => void;
}

export const Context = async (): Promise<Device> => {
  const context = new AudioContext();
  const node = context.createGain();
  node.gain.value = 1.0;
  node.connect(context.destination);

  return {
    context,
    node,
    label: "context",
  };
};

export const Inputs = async (): Promise<MediaDeviceInfo[]> => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === "audioinput");
};

export const Input = async (label: string | null): Promise<MediaDeviceInfo> => {
  const inputs = await Inputs();
  return inputs.find((i) => i.label == label) || inputs[0]!;
};

export const CreateMedia = async (src: string): Promise<DeviceElement> => {
  await Cache(src);

  const el = new Audio();
  el.crossOrigin = "anonymous";
  el.src = src;

  const { context, node, label } = await Media(el);

  return {
    context,
    el,
    label,
    node,
    pauseResume: async () => {
      el.paused ? await el.play() : el.pause();
    },
    progress: (p: number) => {
      el.currentTime = p * el.duration;
    },
  };
};

export const Media = async (el: HTMLMediaElement): Promise<Device> => {
  const context = new AudioContext();
  const node = context.createGain();
  node.gain.value = 1.0;
  node.connect(context.destination);

  const source = context.createMediaElementSource(el);
  source.connect(node);

  return {
    context,
    label: "media",
    node,
  };
};

export const Mic = async (label: string | null): Promise<Device> => {
  const context = new AudioContext();
  const node = context.createGain();

  const input = await Input(label);
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      deviceId: input.deviceId,
    },
  });

  var sourceNode = context.createMediaStreamSource(stream);
  context.resume();

  node.gain.value = 1.0;
  sourceNode.connect(node);

  return {
    context,
    node,
    label: input.label,
  };
};

export const Gesture = () => {
  return {
    gesture: () => {
      const ch = new BroadcastChannel("AUDIO");
      ch.postMessage({
        type: "GESTURE",
      });
    },
    ongesture: async (cb: () => Promise<void>) => {
      await new Promise<void>((resolve, _) => {
        const ch = new BroadcastChannel("AUDIO");
        ch.onmessage = async ({ data }) => {
          if (data.type == "GESTURE") {
            await cb();
            resolve();
          }
        };
      });
    },
  };
};
