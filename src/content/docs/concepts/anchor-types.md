---
title: Anchor types
description: How single anchors, batch anchors, the registry, proof NFTs, and groups differ, and when to use each.
---

ThesisLock spreads its functionality across five Clarity contracts. Each represents a different way to record or organize anchors. They share the same SHA-256 model but differ in keying, ownership, and structure.

## Single anchors

The `thesislock` contract holds one immutable record per hash, keyed by the 32-byte digest alone. The first wallet to anchor a given hash owns that record; the contract rejects a second attempt for the same hash with error `u100`. Each record stores the signer, the Stacks block, the Bitcoin burn block, and a label.

Use single anchors for the common case: timestamp one document under one hash, globally unique.

See [thesislock](/reference/contracts/thesislock/).

## Batch anchors

The `thesislock-batch` contract anchors up to ten hashes in a single transaction, which saves fees and time when timestamping many files at once. Batch records are keyed by the pair `{ hash, owner }`, not by hash alone. That means two different wallets can each batch-anchor the same hash, and verification of a batch anchor requires knowing the owner.

Use batches when anchoring a set of related documents together, for example all chapters of a thesis.

See [thesislock-batch](/reference/contracts/thesislock-batch/).

## The registry

The `thesislock-registry` contract is a per-principal, append-only index. When a wallet registers an anchor, the registry increments that wallet's count and stores the entry at the next index. It powers the "My Anchors" view and lets tools list a wallet's recent activity without scanning the whole chain.

The registry is an index of a wallet's own anchors, keyed by `{ owner, index }`. It does not replace the single or batch contracts; it complements them.

See [thesislock-registry](/reference/contracts/thesislock-registry/).

## Proof NFTs

The `thesislock-proof` contract issues a SIP-009 non-fungible token for an anchor, minted to the creator. These tokens are soulbound: any transfer attempt is rejected with error `u401`, so a proof token permanently stays with the wallet that minted it. Minting a duplicate hash is rejected with `u409`. Each token carries the hash, label, minter, and block heights, and exposes a bidirectional hash-to-token lookup.

Use proof NFTs when you want a wallet-bound, collectible token that represents a timestamp, viewable in NFT-aware tooling.

See [thesislock-proof](/reference/contracts/thesislock-proof/).

## Groups

The `thesislock-groups` contract supports collaborative, named collections. A creator opens a group and becomes its admin and first member; the admin adds and removes members; any member can anchor a hash into the group's ordered ledger. The admin cannot be removed (error `u400`), non-admins cannot perform admin actions (error `u403`), and non-members cannot anchor (error `u403`).

Use groups for shared timelines, for example a research lab or a project team recording artifacts together.

See [thesislock-groups](/reference/contracts/thesislock-groups/).

## Choosing an anchor type

| Need | Use |
| --- | --- |
| One document, globally unique record | Single anchor |
| Many documents in one transaction | Batch |
| List a wallet's own anchors | Registry |
| A wallet-bound token representing a proof | Proof NFT |
| A shared, multi-member timeline | Group |

The SDK's [`verifyAny`](/reference/sdk/) checks the single contract first and then the owner-keyed batch when an owner is supplied, so client code often does not need to choose up front.
