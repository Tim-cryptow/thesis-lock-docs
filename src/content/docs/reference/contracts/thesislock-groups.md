---
title: thesislock-groups
description: The collaborative groups contract - create-group, add-member, remove-member, anchor-to-group, the read-only views, and the admin and membership errors.
---

`SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock-groups`

Named, multi-member collections with a shared, ordered ledger of anchors. A group has one admin (its creator) and a roster of members; any member can anchor into the group.

## Data

```clarity
;; groups map:             group-id -> { name, admin: principal, created-at: uint }
;; group-members map:      { group-id: uint, member: principal } -> membership record
;; group-anchors map:      { group-id: uint, index: uint } -> { hash, label, submitter, block height }
;; group-anchor-count map: group-id -> uint
```

## Public functions

### create-group

```clarity
(define-public (create-group (name (string-ascii 64)))
  ;; -> (response uint uint)  ;; (ok group-id)
)
```

Creates a group with the caller as admin and first member. Returns the new group id.

### add-member

```clarity
(define-public (add-member (group-id uint) (member principal))
  ;; -> (response ... )
)
```

Admin-only. Adds a principal to the group roster. A non-admin caller is rejected with `ERR-NOT-ADMIN` (`u403`).

### remove-member

```clarity
(define-public (remove-member (group-id uint) (member principal))
  ;; -> (response ... )
)
```

Admin-only. Removes a member. The admin cannot remove themselves; that is rejected with `ERR-CANNOT-REMOVE-SELF` (`u400`).

### anchor-to-group

```clarity
(define-public (anchor-to-group (group-id uint) (hash (buff 32)) (label (string-ascii 64)))
  ;; -> (response ... )
)
```

Members only. Appends a hash with metadata to the group's ledger at the next index. A non-member is rejected with `ERR-NOT-MEMBER` (`u403`).

## Read-only functions

```clarity
(define-read-only (get-group (group-id uint)) ;; -> (optional { name, admin, created-at })
(define-read-only (is-member (group-id uint) (who principal)) ;; -> bool
(define-read-only (get-group-anchor-count (group-id uint)) ;; -> uint
(define-read-only (get-group-anchor-at (group-id uint) (index uint)) ;; -> (optional { ... })
(define-read-only (get-recent-group-anchors (group-id uint)) ;; -> (optional (list ...))  up to 10
```

## Errors

| Code | Constant | Meaning |
| --- | --- | --- |
| `u403` | `ERR-NOT-ADMIN` | A non-admin attempted an admin-only operation |
| `u403` | `ERR-NOT-MEMBER` | A non-member attempted to anchor to the group |
| `u400` | `ERR-CANNOT-REMOVE-SELF` | The admin attempted to remove themselves |

Note that `ERR-NOT-ADMIN` and `ERR-NOT-MEMBER` share the code `u403`; the surrounding operation tells you which condition applies.

## Example

Read a group's recent anchors directly over HTTP, as shown in [Calling read-only functions](/reference/contracts/calling-read-only/), or browse groups in the [web app](/guides/web-app/).
