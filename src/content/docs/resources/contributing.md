---
title: Contributing
description: How to contribute to the ThesisLock documentation site - run it locally, follow the conventions, and open a pull request.
---

This documentation site is its own repository, built with [Astro Starlight](https://starlight.astro.build). Contributions that fix errors, clarify wording, or expand coverage are welcome.

## Run the docs locally

```bash
git clone https://github.com/Tim-cryptow/thesis-lock-docs.git
cd thesis-lock-docs
npm install
npm run dev
```

The dev server prints a local URL. Edit any file under `src/content/docs/` and the page reloads.

## Build and check links

```bash
npm run build
```

The build validates internal links and fails if any are broken, so a clean build is a good pre-flight check before opening a pull request. You can preview the production build with `npm run preview`.

## Where content lives

- Pages are Markdown and MDX files under `src/content/docs/`, grouped into `concepts/`, `guides/`, `reference/`, and `resources/`.
- The sidebar and site configuration are in `astro.config.mjs`.
- Brand assets are in `src/assets/` and `public/`.

To add a page, create the file under the right folder and add an entry to the matching `sidebar` group in `astro.config.mjs` so it is linked.

## Accuracy comes first

The product repository and live app are the source of truth. Every signature, flag, endpoint, and error code on this site mirrors them. When you document behavior:

- Verify it against the [contracts](https://github.com/Tim-cryptow/thesis-lock/tree/main/contracts), SDK, CLI, or API source, or the [live docs](https://thesis-lock.vercel.app/docs).
- Do not invent endpoints, parameters, or return shapes.
- Make sure code samples actually run.
- Note any discrepancy you find rather than papering over it.

## Style conventions

- Use clear, plain language.
- Do not use em dashes; use plain hyphens or rephrase.
- Do not use emojis.
- Prefer runnable examples in TypeScript or JavaScript, bash, curl, and Python where relevant.
- Keep one idea per section and use sentence-case headings.

## Commits and pull requests

- Use conventional commit messages: `docs:`, `feat:`, `fix:`, `chore:`.
- Use kebab-case, conventional-commit-prefixed branch names, for example `docs/clarify-batch-keys`.
- Open a pull request describing what changed and why, and confirm the build passes.

## Reporting issues

Found something wrong or missing? Open an issue on the [product repository](https://github.com/Tim-cryptow/thesis-lock/issues) describing the problem and, where relevant, the correct behavior with a source reference.
