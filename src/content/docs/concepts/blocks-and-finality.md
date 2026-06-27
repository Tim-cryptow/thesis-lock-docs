---
title: Blocks, timestamps, finality
description: How ThesisLock records Stacks and Bitcoin block heights, and what finality means for the strength of a proof.
---

A proof of existence is only as strong as the ledger it lives on and the timestamp it carries. ThesisLock records two block heights per anchor so the timestamp can be checked independently and so it inherits Bitcoin's finality.

## Two heights per anchor

Every anchor stores:

- `stacks-block`: the Stacks block height at which the anchoring transaction was included.
- `burn-block`: the Bitcoin block height that the Stacks block settled against. Stacks calls the Bitcoin chain its "burn" chain.

Both are plain integers you can look up in public explorers. The Stacks height can be checked on the [Hiro Explorer](https://explorer.hiro.so), and the burn height on any Bitcoin explorer. Because the burn height ties the record to a specific Bitcoin block, the timestamp does not depend on trusting ThesisLock or even Stacks alone.

## From transaction to timestamp

1. You submit the anchoring transaction from your wallet.
2. A Stacks miner includes it in a block, fixing its `stacks-block` height.
3. That Stacks block settles to a Bitcoin block, fixing its `burn-block` height.
4. As more Bitcoin blocks build on top, reversing the record becomes economically infeasible.

The block heights map to approximate wall-clock times through each chain's block timestamps, which explorers display. ThesisLock stores heights rather than wall-clock times because heights are the canonical, tamper-evident measure of when something happened on chain.

## Finality

On Stacks, finality is anchored to Bitcoin. Once your anchoring transaction is confirmed and the settling Bitcoin block is buried under further blocks, the record is effectively permanent: changing it would require rewriting Bitcoin history. This is the property that makes an anchor a credible long-term proof, suitable for disputes that might arise years later.

Until a transaction is confirmed it is pending and not yet a proof. The web app shows pending status while you wait. After confirmation, the anchor's heights are final and the `/v/<hash>` page and every API surface report it as verified.

## Checking a timestamp independently

Given an anchor's `stacks-block` and `burn-block`, anyone can:

- Open the Stacks block on the Hiro Explorer to read its timestamp and contents.
- Open the corresponding Bitcoin block to confirm the settlement height.
- Re-derive the document's SHA-256 digest and confirm it matches the anchored hash.

No part of that check requires ThesisLock to be online. The proof stands on the public chains alone.
