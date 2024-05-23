# Music SDK

The Music SDK offers:

- REST API for fetching music metadata
- TypeScript UI framework for creating a responsive music player interface
- TypeScript interface for playing music
- Local development docs, stubs and other dev tools

## Quick Start

```bash
pnpm install
pnpm run dev
open http://localhost:4321/skins/html5-vanillajs
```

## Collection API

Collection REST API:

- Fetch meta
- Stream collection playlists
- Fetch collection

Collection Types:

- albums
- singles
- album_track

Example JSON responses are in `public/` for local development

## UI Framework

The main responsibility is to fetch a collection then render a UI, via a page like `https://www.jukelab.com/skins/jukebox/:uri`.

This uses the [Astro web framework](https://astro.build/) which includes support for server or client-side components written in Astro, React, Svelte, Web Components and more.

## Player Interface

```ts
// initialize with optional callbacks
interface Options {
  onEnd?:   (s: PlaybackState)  => void
  onInit?:  (id: string)        => void
  onLog?:   (msg: string)       => void
}

init(opts: Options) : Promise<bool>

// play, pause, and get state
play(uri: string)   : Promise<bool>
pauseResume()       : Promise<bool>
state()             : Promise<PlaybackState | undefined>
```

An example Spotify Web Playback player is included for local development. This requires manually getting an access key at the [developer.spotify.com tutorial](https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started).

## Hosting

JukeLab.com handles the rest of the boring things for you:

- Music Collection API at `jukelab.com/api`
- Spotify authentication at `jukelab.com/auth`
- Music collection preparation `jukelab.com/collections/:uri`
- Hosting at `jukelab.com/skins/:name`
- iOS / Android / Android TV apps
