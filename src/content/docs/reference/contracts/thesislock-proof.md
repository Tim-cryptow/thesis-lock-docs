---
title: thesislock-proof
description: The soulbound proof NFT contract - mint-proof, the SIP-009 interface, get-proof, get-token-id-by-hash, and the soulbound and duplicate errors.
---

`SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock-proof`

Issues a SIP-009 non-fungible token representing an anchor. Tokens are soulbound: they are permanently bound to the minting wallet and cannot be transferred. The token is `uint`-indexed.

## Data

```clarity
;; proof-data map: token-id -> proof record
;; value: { hash: (buff 32), label: (string-ascii 64), anchored-by: principal, stacks-block: uint, burn-block: uint }

;; hash-to-token map: bidirectional lookup from hash to token id
```

## Public functions

### mint-proof

```clarity
(define-public (mint-proof (hash (buff 32)) (label (string-ascii 64)))
  ;; -> (response uint uint)  ;; (ok token-id)
)
```

Mints a proof token to the caller for `hash`, recording the metadata and block heights. Rejects a hash that is already minted with `ERR-DUPLICATE-HASH` (`u409`).

### transfer

```clarity
(define-public (transfer (token-id uint) (sender principal) (recipient principal))
  ;; -> always (err u401)
)
```

Part of the SIP-009 interface, but always returns `ERR-SOULBOUND` (`u401`). The token can never change owners.

## Read-only functions

The contract implements the SIP-009 read-only interface plus proof-specific lookups:

```clarity
(define-read-only (get-last-token-id) ;; -> (response uint uint)
(define-read-only (get-token-uri (token-id uint)) ;; -> (response (optional ...) uint)
(define-read-only (get-owner (token-id uint)) ;; -> (response (optional principal) uint)
(define-read-only (get-proof (token-id uint)) ;; -> (optional { hash, label, anchored-by, stacks-block, burn-block })
(define-read-only (get-token-id-by-hash (hash (buff 32))) ;; -> (optional uint)
(define-read-only (get-proof-by-hash (hash (buff 32))) ;; -> (optional { ... })
```

- `get-proof` reads a proof record by token id.
- `get-token-id-by-hash` resolves a hash to its token id.
- `get-proof-by-hash` resolves a hash directly to its proof record.

## Errors

| Code | Constant | Meaning |
| --- | --- | --- |
| `u401` | `ERR-SOULBOUND` | Transfers are rejected; the token is non-transferable |
| `u409` | `ERR-DUPLICATE-HASH` | A proof for this hash already exists |

## Example

```ts
import { createClient } from 'thesislock-sdk';

const client = createClient();

// By hash
const byHash = await client.getProofByHash(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'
);

// By token id
const byId = await client.getProof(1);

console.log(byHash, byId);
```
