export interface State {
  duration: number;
  paused: boolean;
  position: number;
  uri: string;
}

export interface Options {
  onEnd?: (s: State) => void;
  onInit?: (id: string) => void;
  onLog?: (msg: string) => void;
}

export const State = (): State => {
  return {
    duration: 0,
    paused: true,
    position: 0,
    uri: "",
  };
};
