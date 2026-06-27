---
title: Error codes
description: The consolidated table of ThesisLock Clarity error codes across all contracts, with the conditions that trigger them.
---

Clarity functions return failures as `(err uint)`. This page consolidates every error code ThesisLock contracts can return, grouped by contract.

## All error codes

| Code | Constant | Contract | Condition |
| --- | --- | --- | --- |
| `u100` | `ERR-ALREADY-ANCHORED` | `thesislock` | The hash already has a single anchor |
| `u401` | `ERR-SOULBOUND` | `thesislock-proof` | Transfer attempted on a non-transferable proof token |
| `u409` | `ERR-DUPLICATE-HASH` | `thesislock-proof` | A proof token for this hash already exists |
| `u403` | `ERR-NOT-ADMIN` | `thesislock-groups` | A non-admin attempted an admin-only operation |
| `u403` | `ERR-NOT-MEMBER` | `thesislock-groups` | A non-member attempted to anchor to a group |
| `u400` | `ERR-CANNOT-REMOVE-SELF` | `thesislock-groups` | The admin attempted to remove themselves |

The `thesislock-batch` and `thesislock-registry` contracts define no explicit error constants on the paths documented here; `anchor-batch` returns `(ok batch-id)` on success.

## Notes on shared codes

`thesislock-groups` uses `u403` for two distinct situations, `ERR-NOT-ADMIN` and `ERR-NOT-MEMBER`. The code alone does not tell them apart; the function you called does. If `add-member` or `remove-member` returns `u403`, the caller is not the admin. If `anchor-to-group` returns `u403`, the caller is not a member.

## Handling errors in client code

When you call a public function through a wallet, a returned `(err uint)` causes the post-condition to fail and the transaction to abort. The web app maps these codes to readable messages. If you build your own integration, match on the numeric code:

```ts
function describeError(code: number): string {
  switch (code) {
    case 100:
      return 'This hash is already anchored.';
    case 400:
      return 'The group admin cannot remove themselves.';
    case 401:
      return 'Proof tokens are soulbound and cannot be transferred.';
    case 403:
      return 'You are not authorized for this group action.';
    case 409:
      return 'A proof for this hash already exists.';
    default:
      return `Unexpected error u${code}.`;
  }
}
```

The read-only SDK does not throw these codes; it returns `none`-equivalent results (for example `verified: false` or `null`) when a record is absent. The codes above arise from write transactions.
