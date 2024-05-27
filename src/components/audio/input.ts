export interface Device {
  context: AudioContext;
  node: AudioNode;
  label: String;
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

export const Media = async (el: HTMLMediaElement): Promise<Device> => {
  const context = new AudioContext();
  const node = context.createGain();
  node.gain.value = 1.0;
  node.connect(context.destination);

  const source = context.createMediaElementSource(el);
  source.connect(node);

  return {
    context,
    node,
    label: "media",
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

export const Resume = () => {
  return {
    resume: () => {
      const ch = new BroadcastChannel("AUDIO");
      ch.postMessage({
        type: "RESUME",
      });
    },
    onresume: async (context: AudioContext) => {
      await new Promise<void>((resolve, _) => {
        const ch = new BroadcastChannel("AUDIO");
        ch.onmessage = async ({ data }) => {
          if (data.type == "RESUME") {
            await context.resume();
            resolve();
          }
        };
      });
    },
  };
};
