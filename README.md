# ThesisLock Docs

The documentation site for [ThesisLock](https://thesis-lock.vercel.app), a hash-anchoring proof-of-existence service for academic and creative documents on the Stacks blockchain, secured by Bitcoin.

This repository is a standalone documentation site built with [Astro Starlight](https://starlight.astro.build). It consolidates and expands the docs that live in the product app, covering the protocol, web app, smart contracts, SDK, CLI, REST API, GitHub Action, feeds, and webhooks.

- Live app: https://thesis-lock.vercel.app
- Product source: https://github.com/Tim-cryptow/thesis-lock

## Prerequisites

- Node.js 18 or newer
- npm

## Install

```bash
npm install
```

## Develop

```bash
npm run dev
```

Starts the dev server with hot reload and prints a local URL. Edit any file under `src/content/docs/` to see changes live.

## Build

```bash
npm run build
```

Produces a static site in `dist/`. The build also validates internal links and fails if any are broken, so a clean build is a useful pre-flight check.

## Preview

```bash
npm run preview
```

Serves the production build locally.

## Type check

```bash
npm run check
```

Runs `astro check` with TypeScript in strict mode.

## Project layout

```
src/
  assets/            brand assets imported by pages and config
  content/
    docs/            all documentation pages (Markdown and MDX)
      concepts/
      guides/
      reference/
        contracts/
      resources/
  styles/            theme overrides
public/              static files served as-is (favicon, OG image)
astro.config.mjs     site config and sidebar
```

To add a page, create a Markdown or MDX file under the appropriate folder in `src/content/docs/`, then add an entry to the matching `sidebar` group in `astro.config.mjs`.

## Deploy

The site is a static Astro build and deploys to Vercel out of the box.

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`

A `vercel.json` is included with these settings. Pushing to the default branch deploys production; pull requests get preview deployments. The site can also be hosted on any static host or GitHub Pages by serving the contents of `dist/`.

## Continuous integration

`.github/workflows/ci.yml` installs dependencies, type-checks, and builds the site on every push and pull request. Because the build runs the internal link validator, broken internal links fail CI.

## License

[MIT](./LICENSE)
