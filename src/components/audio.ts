export interface PlaybackState {
  duration: number;
  paused: boolean;
  position: number;
  uri: string;
}

export interface Options {
  onInit?: (id: string) => void;
  onLog?: (msg: string) => void;
  onEnd?: (s: PlaybackState) => void;
}

export const PlaybackState = (): PlaybackState => {
  return {
    duration: 0,
    paused: true,
    position: 0,
    uri: "",
  };
};
