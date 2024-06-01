export type Payload = any;

export interface Art {
  jpg: string;
  player: number /* int */;
}

export interface Beat {
  beat: number /* int */;
  onAir: boolean;
  player: number /* int */;
}

export interface CDJ {
  barBeat: number /* int */;
  beat: number /* int */;
  looping: boolean;
  master: boolean;
  masterPlayer: number /* int */;
  name: string;
  onAir: boolean;
  paused: boolean;
  player: number /* int */;
  playing: boolean;
  sync: boolean;
  tempo: number /* float64 */;
  trackSource: Source;
}

export interface Cue {
  beat: number /* int */;
  comment: string;
  onAir: boolean;
  player: number /* int */;
}

export interface Device {
  active: boolean;
  name: string;
  player: number /* int */;
}

export interface Err {
  code: number /* int */;
  error: string;
}

export interface Grid {
  beats: GridBeat[];
  player: number /* int */;
}

export interface GridBeat {
  beat: number /* int */;
  ms: number /* int64 */;
}

export interface Message {
  payload: any;
  ms: number /* int64 */;
  type: string;
  version: number /* int */;
}

export interface Phrase {
  beat: number /* int */;
  kind: string;
  onAir: boolean;
  player: number /* int */;
}

export interface Player {
  art?: Art;
  beat?: Beat;
  phrase?: Phrase;
  track?: Track;
}

export interface Session {
  active: boolean;
  channel: number /* int */;
  desc: string;
  device: string;
  dir: string;
  user: string;
}

export interface Source {
  id: number /* int */;
  player: number /* int */;
  slot: string;
}

export interface Structure {
  bank: string;
  mood: string;
  phrases: StructurePhrase[];
  player: number /* int */;
}

export interface StructurePhrase {
  beat: number /* int */;
  kind: string;
}

export interface Sys {
  code: number /* int */;
  msg: string;
}

export interface Track {
  album: string;
  artist: string;
  duration: number /* int64 */;
  player: number /* int */;
  source: Source;
  tempo: number /* float64 */;
  title: string;
  year: number /* int */;
}

export interface TrackCue {
  comment: string;
  ms: number /* int64 */;
}

export interface Waveform {
  data: string;
  player: number /* int */;
}

export const Messages = async (url: string) => {
  const res = await fetch(url);
  return (await res.json()) as Message[];
};

export const Phrases = async (url: string) => {
  const msgs = await Messages(url);
  return msgs.filter((msg) => msg.type == "phrase");
};
