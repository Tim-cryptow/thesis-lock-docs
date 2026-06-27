---
title: thesislock
description: The single-anchor contract - anchor-document, get-anchor, is-anchored, the anchors map, and the already-anchored error.
---

`SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock`

The original contract. It stores one immutable record per hash, keyed by the 32-byte digest alone, so each hash can be single-anchored exactly once across all wallets.

## Data

The `anchors` map is keyed by the hash and stores who anchored it, both block heights, and the label.

```clarity
;; key: (buff 32)
;; value:
{
  anchored-by: principal,
  stacks-block: uint,
  burn-block: uint,
  label: (string-ascii 64)
}
```

## Public functions

### anchor-document

```clarity
(define-public (anchor-document (hash (buff 32)) (label (string-ascii 64)))
  ;; -> (response bool uint)
)
```

Records `hash` under the caller's principal with the current Stacks and Bitcoin block heights and the supplied `label`. Fails with `ERR-ALREADY-ANCHORED` (`u100`) if the hash is already anchored.

## Read-only functions

### get-anchor

```clarity
(define-read-only (get-anchor (hash (buff 32)))
  ;; -> (optional {
  ;;      anchored-by: principal,
  ;;      stacks-block: uint,
  ;;      burn-block: uint,
  ;;      label: (string-ascii 64)
  ;;    })
)
```

Returns the anchor record for `hash`, or `none` if the hash has never been anchored.

### is-anchored

```clarity
(define-read-only (is-anchored (hash (buff 32)))
  ;; -> (optional bool)
)
```

A lightweight existence check for `hash`.

## Errors

| Code | Constant | Meaning |
| --- | --- | --- |
| `u100` | `ERR-ALREADY-ANCHORED` | The hash already has a single anchor |

## Example

Verify with the SDK, which wraps `get-anchor`:

```ts
import { createClient } from 'thesislock-sdk';

const client = createClient();
const result = await client.verify(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06'
);
console.log(result.verified, result.label, result.stacksBlock);
```

To call `get-anchor` directly over HTTP, see [Calling read-only functions](/reference/contracts/calling-read-only/).
