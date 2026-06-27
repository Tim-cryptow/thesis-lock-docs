---
title: Quickstart
description: Anchor your first document with the ThesisLock web app, then verify it. No installation required.
---

import { Steps } from '@astrojs/starlight/components';

This guide takes you from nothing to a permanent, verifiable on-chain timestamp in a few minutes. You need a Stacks wallet and a small amount of STX to cover the transaction fee.

## Before you start

- Install a Stacks wallet browser extension: [Leather](https://leather.io), [Xverse](https://www.xverse.app), or [Asigna](https://asigna.io).
- Fund it with a little STX for network fees.
- Have a file ready to anchor. It stays on your device the entire time.

## Anchor a document

<Steps>

1. Open the app at [thesis-lock.vercel.app](https://thesis-lock.vercel.app) and connect your wallet with the connect button. ThesisLock requests no custody and cannot move your funds; it only asks you to sign the anchoring transaction.

2. Drop your file onto the anchor area, or click to choose one. Your browser computes the SHA-256 digest locally and shows you the 64-character hex hash. The file is never uploaded.

3. Add an optional label, for example `Thesis final draft`. Labels are public, so keep them generic if the title is sensitive. Labels can be up to 64 ASCII characters.

4. Click anchor and approve the transaction in your wallet. This calls `anchor-document` on the `thesislock` contract.

5. Wait for confirmation. Once the transaction is mined, the anchor records who signed it, the Stacks block height, the Bitcoin (burn) block height, and your label.

</Steps>

## Verify a document

Anyone, including you, can verify an anchor without a wallet.

<Steps>

1. Go to `https://thesis-lock.vercel.app/v/<hash>`, replacing `<hash>` with the 64-character digest. The verification page shows the anchor's owner, label, and both block heights.

2. To confirm a specific file matches, re-upload it on the verification page. The browser hashes it locally and compares the digest to the anchored value. A match proves the file is byte-for-byte identical to the one originally anchored.

</Steps>

## Verify from the command line

You do not need the web app to verify. With the [CLI](/reference/cli/):

```bash
# Install once
npm install -g thesislock-cli

# Hash a local file and check whether that hash is anchored
thesislock hash thesis.pdf --verify

# Or verify a known hash directly
thesislock verify 9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06
```

Or with a single HTTP request against the [REST API](/reference/rest-api/):

```bash
curl "https://thesis-lock.vercel.app/api/verify/9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06"
```

## Where to go next

- [Concepts](/concepts/anchor-types/) explains anchors, batches, the registry, proof NFTs, and groups.
- [Web app guide](/guides/web-app/) covers every feature of the app in depth.
- [Scripting and CI](/guides/scripting-and-ci/) shows how to automate anchoring checks.
