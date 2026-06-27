---
title: thesislock-batch
description: The batch-anchor contract - anchor-batch for up to ten hashes, get-batch-anchor, get-batch-count, and the owner-keyed batch-anchors map.
---

`SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock-batch`

Anchors up to ten hashes in a single transaction. Records are keyed by the pair `{ hash, owner }`, so verifying a batch anchor requires both the hash and the owning principal.

## Data

```clarity
;; batch-anchors map
;; key:   { hash: (buff 32), owner: principal }
;; value: { label: (string-ascii 64), stacks-block: uint, burn-block: uint, batch-id: uint }

;; batch-counter
(define-data-var batch-counter uint u0)
```

## Public functions

### anchor-batch

```clarity
(define-public (anchor-batch
    (entries (list 10 { hash: (buff 32), label: (string-ascii 64) })))
  ;; -> (response uint uint)  ;; (ok batch-id)
)
```

Records each entry under the caller's principal with the current block heights and a shared, newly assigned `batch-id`. Accepts up to ten entries per call. Returns the assigned batch id.

## Read-only functions

### get-batch-anchor

```clarity
(define-read-only (get-batch-anchor (hash (buff 32)) (owner principal))
  ;; -> (optional {
  ;;      label: (string-ascii 64),
  ;;      stacks-block: uint,
  ;;      burn-block: uint,
  ;;      batch-id: uint
  ;;    })
)
```

Returns the batch record for the given hash and owner, or `none`.

### get-batch-count

```clarity
(define-read-only (get-batch-count)
  ;; -> uint
)
```

Returns the current value of the batch counter, that is, how many batches have been recorded.

## Errors

This contract defines no explicit error constants. `anchor-batch` returns `(ok batch-id)` on success.

## Example

Because batch records are owner-keyed, supply the owner when verifying:

```ts
import { createClient } from 'thesislock-sdk';

const client = createClient();
const result = await client.verifyBatch(
  '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06',
  'SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM'
);
console.log(result.verified, result.batchId);
```

Or with the CLI:

```bash
thesislock verify 9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06 \
  --owner SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM
```
