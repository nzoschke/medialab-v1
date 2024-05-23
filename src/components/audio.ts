export interface PlaybackState {
  duration: number;
  paused: boolean;
  position: number;
  uri: string;
}

export const PlaybackState = (): PlaybackState => {
  return {
    duration: 0,
    paused: true,
    position: 0,
    uri: "",
  };
};
