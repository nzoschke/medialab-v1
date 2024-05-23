export interface State {
  duration: number;
  paused: boolean;
  position: number;
  uri: string;
}

export interface Options {
  onInit?: (id: string) => void;
  onLog?: (msg: string) => void;
  onEnd?: (s: State) => void;
}

export const State = (): State => {
  return {
    duration: 0,
    paused: true,
    position: 0,
    uri: "",
  };
};
