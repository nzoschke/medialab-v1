# GIT Media Lab

Building music and video apps is easier than ever, once you figure out HTML Audio, HTML Video, Web Audio, Canvas and other web technology to support multi-media.

This is an app that demonstrates media pieces configured correctly and explained in depth. See [the docs folder](src/content/doc) for detailed guides about audio, video, music APIs, metadata and more.

## Quick Start

This project uses:

- Astro
- TypeScript
- Node
- pnpm

Install the CLI tools

```bash
brew install node
npm install -g pnpm
```

### Get the app

We start by getting and testing `medialab`:

```bash
git clone https://github.com/nzoschke/medialab.git
cd medialab
pnpm install
pnpm test -- --run
```

This gives us confidence in our TS / JS / web environment.

### Develop the app

We can then build the app and start a development server:

```bash
pnpm run dev

> medialab@0.0.1 dev
> astro dev
 astro  v4.8.6 ready in 285 ms

┃ Local    http://localhost:4321/
```

Now we can access our web app on [http://localhost:4321/](http://localhost:4321/).

This gives us confidence in our development environment.

## Docs

Check out [the docs folder](src/content/doc) where each component is explained in more detail.

## Contributing

Find a bug or see a way to improve the project? [Open an issue](https://github.com/nzoschke/medialab/issues).

## Sponsors

This project is sponsored by [JukeLab](https://jukelab.com) and [VizLab](https://vizlab.app).
