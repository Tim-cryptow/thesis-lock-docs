---
title: Verifying a document
description: How to verify an anchor through the web app, the verification URL, the CLI, the SDK, and the REST API, and how re-uploading confirms a file match.
---

Verification answers two questions: is this hash anchored, and does a given file produce that hash? Anyone can do both, with no wallet and no account.

## The verification URL

Every anchor has a public page at:

```
https://thesis-lock.vercel.app/v/<hash>
```

Replace `<hash>` with the 64-character hex digest. The page shows whether the hash is anchored, the owning wallet, the label, and the Stacks and Bitcoin block heights. Share this URL to let anyone inspect the anchor.

## Re-uploading to confirm a match

Showing that a hash is anchored is only half a proof. To prove that your copy of a file is the one that was anchored, re-upload it on the verification page. The browser hashes the file locally with SHA-256 and compares the result to the anchored hash. A match means the file is byte-for-byte identical to the original. The file is hashed in the browser and never uploaded to a server.

You can reproduce the same check offline:

```bash
sha256sum thesis.pdf
# compare the printed digest to the anchored hash
```

## Verifying with the CLI

```bash
# Hash a local file and check the chain in one step
thesislock hash thesis.pdf --verify

# Verify a known hash
thesislock verify 9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06

# Verify an owner-keyed batch anchor
thesislock verify 9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06 --owner SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM
```

The `verify` command exits 0 when anchored and 1 when not, which makes it usable directly in shell conditionals. See the [CLI reference](/reference/cli/).

## Verifying with the SDK

```ts
import { createClient } from 'thesislock-sdk';

const client = createClient();
const result = await client.verify(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'
);

if (result.verified) {
  console.log('Anchored by', result.owner, 'at Stacks block', result.stacksBlock);
} else {
  console.log('Not anchored');
}
```

See the [SDK reference](/reference/sdk/).

## Verifying with the REST API

```bash
# Path form
curl "https://thesis-lock.vercel.app/api/verify/9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06"

# Upload a file and let the server compute and check its hash
curl -F "file=@thesis.pdf" https://thesis-lock.vercel.app/api/verify
```

The POST form returns the same shape as the path form, with an added `computedHash` field when you upload a file. See the [REST API reference](/reference/rest-api/).

## Which contract answers

Verification resolves against the chain, trying the single-anchor contract first. Supplying an owner additionally checks the owner-keyed batch contract. The SDK's `verifyAny` and the CLI's `verify --owner` both follow this order, so you rarely need to pick a contract yourself.
