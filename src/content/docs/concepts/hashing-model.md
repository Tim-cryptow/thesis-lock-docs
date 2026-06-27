---
title: The SHA-256 model
description: How ThesisLock uses SHA-256 digests, the hex format it expects, and why client-side hashing keeps documents private.
---

Every anchor in ThesisLock is built on one primitive: the SHA-256 digest of a document.

## What gets hashed

SHA-256 takes the raw bytes of a file and produces a 256-bit (32-byte) digest. ThesisLock represents that digest as a lowercase 64-character hexadecimal string, for example:

```
9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06
```

The hash is computed over the exact byte content of the file. Any change, even a single byte, produces a completely different digest. This is what makes the proof meaningful: a matching hash means a byte-for-byte identical file.

On chain the digest is stored as a Clarity `(buff 32)` value. The SDK utility `serializeHash` encodes a hex string into that serialized buffer form when you need to call a contract directly.

## Hex format and validation

ThesisLock accepts the 64-character hex digest with or without a `0x` prefix and is case-insensitive on input, but it normalizes to lowercase without the prefix for storage and display. The SDK's `isValidHash` enforces the 64-hex-character rule, and `truncateHash` shortens a digest to its first and last characters for compact display.

```ts
import { isValidHash, truncateHash } from 'thesislock-sdk';

isValidHash('9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'); // true
truncateHash('9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'); // "9afe6f57...28585d06"
```

## Why client-side hashing

The browser computes the digest with the Web Crypto API before anything is sent anywhere. The implication is privacy by construction:

- The file's bytes are read into local memory, hashed, and never transmitted.
- Only the digest and an optional label reach the network and the chain.
- Because SHA-256 is a one-way function, the published digest reveals nothing about the file.

You can reproduce the same digest yourself to confirm the app is honest. On most systems:

```bash
# macOS and Linux
shasum -a 256 thesis.pdf

# Linux (coreutils)
sha256sum thesis.pdf
```

```ts
// Node.js
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const hash = createHash('sha256').update(readFileSync('thesis.pdf')).digest('hex');
console.log(hash);
```

```python
# Python
import hashlib
print(hashlib.sha256(open("thesis.pdf", "rb").read()).hexdigest())
```

All four methods (the web app, the CLI's `hash` command, and the snippets above) produce the same 64-character digest for the same file. That reproducibility is the foundation of independent verification.

## Hashing strings

For text or structured data you can hash a string directly. The SDK's `hashString` returns the SHA-256 of a string's UTF-8 bytes, which is handy for anchoring a canonical JSON document or a commitment value.

```ts
import { hashString } from 'thesislock-sdk';

hashString('the quick brown fox'); // 64-character hex digest
```
