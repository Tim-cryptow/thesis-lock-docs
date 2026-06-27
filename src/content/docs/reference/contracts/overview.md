---
title: Smart contracts overview
description: The five ThesisLock Clarity contracts, their deployer principal, contract id format, and how to read them on chain.
---

ThesisLock is implemented as five Clarity 3 contracts deployed to Stacks mainnet with Clarinet. They are public and read-only callable by anyone.

## Deployer and contract ids

All contracts are deployed under one principal:

```
SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM
```

A contract id is the deployer principal, a dot, and the contract name:

```
SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.<contract-name>
```

## The five contracts

| Contract | Purpose | Key reference |
| --- | --- | --- |
| `thesislock` | One immutable single-hash anchor per hash | [Details](/reference/contracts/thesislock/) |
| `thesislock-batch` | Up to ten hashes per transaction, keyed by hash and owner | [Details](/reference/contracts/thesislock-batch/) |
| `thesislock-registry` | Per-principal append-only index of anchors | [Details](/reference/contracts/thesislock-registry/) |
| `thesislock-proof` | SIP-009 soulbound proof NFTs | [Details](/reference/contracts/thesislock-proof/) |
| `thesislock-groups` | Named groups for collaborative anchoring | [Details](/reference/contracts/thesislock-groups/) |

## Reading the contracts

There are three ways to read on-chain state, from highest to lowest level:

1. The [SDK](/reference/sdk/) and [CLI](/reference/cli/), which wrap the read-only calls.
2. The [REST API](/reference/rest-api/), which resolves verification against the chain.
3. Direct read-only calls to the Hiro Stacks API, documented in [Calling read-only functions](/reference/contracts/calling-read-only/).

Writes (anchoring, minting, group management) require a signed transaction from a wallet and are normally done through the web app.

## Data conventions

- Hashes are stored as Clarity `(buff 32)` values, the raw 32 bytes of a SHA-256 digest. The hex string you see in the UI is the same value, hex-encoded.
- Labels are `(string-ascii 64)`, up to 64 ASCII characters.
- Block heights are `uint`. Each anchor records both a Stacks block height and a Bitcoin burn block height where applicable.
- Errors are returned as `(err uint)`. See the consolidated [error codes](/reference/contracts/error-codes/) table.

## Source

The Clarity source lives in the [contracts directory](https://github.com/Tim-cryptow/thesis-lock/tree/main/contracts) of the product repository and is the authoritative definition. The signatures on the following pages mirror that source.
