export interface PlayerState {
  duration: number;
  paused: boolean;
  position: number;
  uri: string;
}

export interface Options {
  onInit?: (id: string) => void;
  onLog?: (msg: string) => void;
  onEnd?: (s: PlayerState) => void;
}

export const PlayerState = (): PlayerState => {
  return {
    duration: 0,
    paused: true,
    position: 0,
    uri: "",
  };
};
