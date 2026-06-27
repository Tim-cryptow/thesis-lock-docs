---
title: thesislock-registry
description: The per-principal registry - register-anchor, get-anchor-count, get-anchor-at, get-recent-anchors, and the anchor-index map.
---

`SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock-registry`

A per-principal, append-only index of anchors. It lets tools list a wallet's own anchors and powers the "My Anchors" view without scanning the whole chain.

## Data

```clarity
;; anchor-index map
;; key:   { owner: principal, index: uint }
;; value: { hash: (buff 32), label: (string-ascii 64), anchored-at: uint }

;; anchor-count map
;; key:   principal
;; value: uint
```

## Public functions

### register-anchor

```clarity
(define-public (register-anchor (hash (buff 32)) (label (string-ascii 64)))
  ;; -> (response ... )
)
```

Registers an anchor for the caller: it increments the caller's `anchor-count` and stores the entry at the next index along with the block height.

## Read-only functions

### get-anchor-count

```clarity
(define-read-only (get-anchor-count (owner principal))
  ;; -> uint
)
```

Returns how many anchors a principal has registered. Defaults to `u0` for an unknown principal.

### get-anchor-at

```clarity
(define-read-only (get-anchor-at (owner principal) (index uint))
  ;; -> (optional { hash: (buff 32), label: (string-ascii 64), anchored-at: uint })
)
```

Returns the entry at a specific index for a principal, or `none`.

### get-recent-anchors

```clarity
(define-read-only (get-recent-anchors (owner principal))
  ;; -> (list ... )  ;; up to 10, reverse chronological
)
```

Returns up to the ten most recent entries for a principal, newest first.

## Errors

This contract defines no explicit error constants for its read paths.

## Example

```ts
import { createClient } from 'thesislock-sdk';

const client = createClient();
const owner = 'SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM';

const count = await client.getAnchorCount(owner);
const recent = await client.getRecentAnchors(owner);

console.log(`${owner} has ${count} anchors; latest:`, recent[0]);
```

With the CLI:

```bash
thesislock status SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM
```
