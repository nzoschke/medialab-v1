export interface Collection {
  author: string;
  description: string;
  guid: string;
  link: string;
  title: string;
  uri: string;
  images: string[];
  playlists: Playlist[];
}

export interface Playlist {
  author: string;
  description: string;
  guid: string;
  link: string;
  title: string;
  uri: string;
  images: string[];
  tracks: Track[];
}

export interface Track {
  author: string;
  description: string;
  guid: string;
  duration: number /* int */;
  link: string;
  title: string;
  uri: string;
  video: string;
}
