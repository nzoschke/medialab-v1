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

export type PlaylistMeta = Omit<Playlist, "tracks">;

export interface Track {
  author: string;
  description: string;
  guid: string;
  duration: number;
  link: string;
  title: string;
  uri: string;
  video: string;
}

export interface PlaylistTrack {
  playlist: PlaylistMeta;
  track: Track;
}

export const Collection = (): Collection => {
  return {
    author: "",
    description: "",
    guid: "",
    link: "",
    title: "",
    uri: "",
    images: [],
    playlists: [],
  };
};

export const Playlist = (): Playlist => {
  return {
    author: "",
    description: "",
    guid: "",
    link: "",
    title: "",
    uri: "",
    images: [],
    tracks: [],
  };
};

export const Track = (): Track => {
  return {
    author: "",
    description: "",
    guid: "",
    duration: 0,
    link: "",
    title: "",
    uri: "",
    video: "",
  };
};

export const PlaylistTrack = (p: Playlist, track: Track): PlaylistTrack => {
  return {
    playlist: {
      author: p.author,
      description: p.description,
      guid: p.guid,
      link: p.link,
      title: p.title,
      uri: p.uri,
      images: p.images,
    },
    track,
  };
};

export const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length;
  let randomIndex = 0;
  randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex]!, array[currentIndex]!];
  }

  return array;
};
