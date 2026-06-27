---
title: FAQ
description: Frequently asked questions about ThesisLock - privacy, cost, what proof of existence does and does not prove, and how to recover from common situations.
---

## Does my document ever leave my device?

No, when you use the web app. The browser hashes the file locally with SHA-256 and only the 64-character digest and your optional label are sent to the chain. The file's bytes are never uploaded. The one exception is the REST API's `POST /api/verify` file-upload form, which sends the file to the server to compute its hash; use the path-based `GET /api/verify/{hash}` or hash locally if you want to avoid that.

## What does an anchor actually prove?

It proves that a file producing exactly that hash existed at or before the anchor's block height, and that the anchoring wallet attested to it. It does not prove who authored the file, that the content is true, or that the wallet holder is any particular real-world person. It is a tamper-evident timestamp, not an identity or authorship claim.

## Can two people anchor the same document?

For single anchors, no: the `thesislock` contract stores one record per hash, and a duplicate is rejected with error `u100`. The first wallet to anchor a hash owns that record. Batch anchors are keyed by hash and owner, so different wallets can each batch-anchor the same hash; that is why verifying a batch anchor needs the owner.

## What does it cost?

Reading and verifying are free and need no wallet. Anchoring requires a Stacks transaction, so you pay the network fee in STX. Batch anchoring up to ten hashes in one transaction is cheaper per document than anchoring each separately.

## Do I need an account or API key?

No. The web app needs only a wallet to anchor. The read API is public and unauthenticated. API keys exist as an optional, client-side convenience for your own scoping and tracking; they are not required to call any endpoint.

## What if I lose the original file?

The anchor remains on chain, but you can no longer prove a match without a copy that hashes to the anchored value. The hash is a fingerprint, not a backup. Keep the file safe; the anchor only proves a file you hold is the one you anchored.

## What if I anchor the wrong file or label?

Anchors are immutable and cannot be edited or deleted. Anchor the correct file as a new record. A wrong label does not weaken the proof of the hash; it just mislabels it.

## Is the data permanent?

The on-chain record is as permanent as the Stacks chain, which settles to Bitcoin. Even if every ThesisLock service went offline, your anchor stays readable directly from the contracts. See [Calling read-only functions](/reference/contracts/calling-read-only/).

## Why are some anchors slow to appear in search?

Verification reads the chain and is immediate. Search, activity, and feeds read an optional index populated by a chainhook, which can lag a freshly mined anchor by a short interval. The anchor is verifiable on chain the moment it confirms.

## Which wallets are supported?

The web app uses Stacks Connect and supports Leather, Xverse, and Asigna.
