---
title: SDK
description: The thesislock-sdk read-only TypeScript client - install, configuration, every method and util, exported types, and error handling.
---

`thesislock-sdk` is a read-only client for reading anchors from the ThesisLock contracts. It runs on Node.js 18 or newer and in the browser, and ships TypeScript types. Being read-only, it never signs or sends transactions; anchoring is done through a wallet in the [web app](/guides/web-app/).

## Install

```bash
npm install thesislock-sdk
```

## Create a client

Two equivalent entry points are exported: a factory and a constructor.

```ts
import { createClient, ThesisLockClient } from 'thesislock-sdk';

// Factory
const client = createClient();

// Constructor
const client2 = new ThesisLockClient();
```

### Configuration

Both accept an optional config object. All fields have sensible mainnet defaults.

```ts
const client = createClient({
  apiUrl: 'https://api.mainnet.hiro.so',
  contractAddress: 'SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM',
  network: 'mainnet',
});
```

| Field | Type | Default |
| --- | --- | --- |
| `apiUrl` | `string` | `https://api.mainnet.hiro.so` |
| `contractAddress` | `string` | `SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM` |
| `network` | `'mainnet' \| 'testnet'` | `mainnet` |

## Methods

### verify

```ts
verify(hash: string): Promise<VerifyResult>
```

Looks up a single anchor in the `thesislock` contract.

```ts
const result = await client.verify(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'
);
if (result.verified) {
  console.log(result.owner, result.label, result.stacksBlock, result.burnBlock);
}
```

### verifyBatch

```ts
verifyBatch(hash: string, owner: string): Promise<VerifyResult>
```

Looks up an owner-keyed batch anchor in `thesislock-batch`. Both the hash and the owning principal are required.

```ts
const result = await client.verifyBatch(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06',
  'SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM'
);
```

### verifyAny

```ts
verifyAny(hash: string, owner?: string): Promise<VerifyResult>
```

Tries the single anchor first, then the owner-keyed batch anchor when an `owner` is provided. This is the convenient default when you do not know which contract holds the anchor.

```ts
const result = await client.verifyAny(hash, owner);
```

### getAnchorCount

```ts
getAnchorCount(owner: string): Promise<number>
```

Returns the number of anchors a principal has registered in `thesislock-registry`.

```ts
const count = await client.getAnchorCount('SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM');
```

### getRecentAnchors

```ts
getRecentAnchors(owner: string): Promise<RegistryEntry[]>
```

Returns up to the ten most recent registry entries for a principal, newest first.

```ts
const recent = await client.getRecentAnchors('SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM');
for (const entry of recent) {
  console.log(entry.hash, entry.label);
}
```

### getProof

```ts
getProof(tokenId: number): Promise<ProofNFT | null>
```

Reads a soulbound proof NFT by token id from `thesislock-proof`. Returns `null` if no such token exists.

```ts
const proof = await client.getProof(1);
```

### getProofByHash

```ts
getProofByHash(hash: string): Promise<ProofNFT | null>
```

Resolves a proof NFT from the hash it anchors. Returns `null` if the hash has no proof token.

```ts
const proof = await client.getProofByHash(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'
);
```

## Utilities

These are exported as standalone functions and do not require a client.

```ts
import {
  hashString,
  hashFile,
  isValidHash,
  serializeHash,
  truncateHash,
} from 'thesislock-sdk';
```

| Util | Signature | Description |
| --- | --- | --- |
| `hashString` | `(input: string) => string` | Lowercase 64-char hex SHA-256 of a string's UTF-8 bytes |
| `hashFile` | `(file: File \| Buffer) => Promise<string>` | Lowercase 64-char hex SHA-256 of a `File` or `Buffer` |
| `isValidHash` | `(hash: string) => boolean` | Validates 64 hex characters; accepts an optional `0x` prefix and uppercase |
| `serializeHash` | `(hex: string) => string` | Encodes a 64-char hex hash as a serialized Clarity `(buff 32)` value |
| `truncateHash` | `(hash: string, chars?: number) => string` | Shortens a hash to its first and last `chars` characters (default 8) |

```ts
const digest = hashString('the quick brown fox');
const fileDigest = await hashFile(buffer);
isValidHash(digest);               // true
serializeHash(digest);             // "0x0200000020..."
truncateHash(digest);              // "9afe6f57...28585d06"
```

## Types

The SDK exports these TypeScript types:

- `AnchorResult` - a single anchor record.
- `BatchAnchorResult` - an owner-keyed batch anchor record.
- `RegistryEntry` - one entry from a principal's registry.
- `ProofNFT` - a proof token record.
- `VerifyResult` - a discriminated union on the `verified` field.

```ts
import type { VerifyResult } from 'thesislock-sdk';

function describe(result: VerifyResult): string {
  if (result.verified) {
    // Narrowed to the verified branch
    return `Anchored by ${result.owner} at block ${result.stacksBlock}`;
  }
  return 'Not anchored';
}
```

Because `VerifyResult` is discriminated on `verified`, checking that field narrows the type so the anchor fields are only accessible once you have confirmed a match.

## Error handling

Read methods do not throw for an absent record: `verify` family calls return a `VerifyResult` with `verified: false`, and `getProof`/`getProofByHash` return `null`. Network or API failures (for example an unreachable Hiro endpoint) reject the returned promise, so wrap calls in `try`/`catch` when reliability matters.

```ts
try {
  const result = await client.verifyAny(hash, owner);
  // handle result.verified
} catch (err) {
  console.error('Could not reach the chain:', err);
}
```
