---
title: On-chain truth vs the index
description: How ThesisLock separates the authoritative blockchain from an optional Supabase index used only for speed and search.
---

ThesisLock has two data layers. Understanding which one is authoritative explains why the service can offer fast search and live feeds without ever weakening its guarantees.

## The chain is the source of truth

Every anchor lives in a Clarity contract on Stacks mainnet. That on-chain record is the only authoritative one. To read it, ThesisLock and its SDK, CLI, and API call the contract's read-only functions through the Hiro Stacks API at `https://api.mainnet.hiro.so`. These calls hit the chain directly and return exactly what consensus recorded.

If the index and the chain ever disagree, the chain wins. Verification endpoints resolve against the chain, not the index.

## The index is an optional accelerator

Querying the chain for "every anchor by this wallet" or "every anchor matching this label" would be slow if done naively. To make search, activity views, feeds, and stats fast, ThesisLock can maintain an optional index: a Supabase table named `thesis_locks`.

The index is populated by the Hiro Chainhook system. A chainhook watches the ThesisLock contracts and posts each matching on-chain event to the app's `/api/chainhooks` endpoint, which writes a row into Supabase. The index therefore mirrors the chain; it never originates data.

```
On-chain event  ->  Hiro Chainhook  ->  POST /api/chainhooks  ->  Supabase thesis_locks
                                                                       |
                              fast search, feeds, activity, stats  <---
```

## What this means in practice

- Verification (`/v/<hash>`, `GET /api/verify/<hash>`, the SDK's `verify`/`verifyAny`, the CLI's `verify`) reads the chain, so a result is trustworthy even if the index is empty or stale.
- Discovery (search, activity, feeds, stats) reads the index for speed. A freshly mined anchor may take a moment to appear in these views until the chainhook delivers it, but it is verifiable on chain immediately.
- You never have to trust the index. Anything it shows can be reconfirmed against the contract.

## Reading the chain yourself

Because the contracts are public, you can bypass ThesisLock entirely and call read-only functions through Hiro. See [Calling read-only functions](/reference/contracts/calling-read-only/) for the exact request shape. This is the ultimate fallback: even if every ThesisLock service went away, your anchors would remain readable and verifiable directly from Stacks.
