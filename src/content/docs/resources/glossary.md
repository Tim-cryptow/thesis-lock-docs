---
title: Glossary
description: Definitions of the terms used across the ThesisLock documentation, from anchor to soulbound.
---

## Anchor

An on-chain record that ties a document's SHA-256 hash to a wallet, a label, and block heights. Creating one is "anchoring."

## Batch anchor

A record in the `thesislock-batch` contract that timestamps up to ten hashes in one transaction. Keyed by `{ hash, owner }`.

## Burn block

The Bitcoin block height that a Stacks block settles against. ThesisLock stores it alongside the Stacks block height so a timestamp can be checked on Bitcoin.

## Chainhook

A Hiro mechanism that watches the chain for matching events and posts them to a URL. ThesisLock uses one to populate its optional index at `/api/chainhooks`.

## Clarity

The smart-contract language used on Stacks. It is decidable and non-Turing-complete, and its source is published on chain. ThesisLock's contracts are Clarity 3.

## Contract id

The deployer principal, a dot, and a contract name, for example `SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock`.

## Digest

The output of a hash function. For ThesisLock, a 32-byte SHA-256 value shown as 64 hex characters.

## Finality

The point at which a transaction becomes practically irreversible. On Stacks, finality is anchored to Bitcoin.

## Group

A named, multi-member collection in the `thesislock-groups` contract with a shared, ordered ledger of anchors.

## Hash

Used interchangeably with digest here: the SHA-256 fingerprint of a document.

## Hiro Stacks API

The public API at `https://api.mainnet.hiro.so` used to read contract state and call read-only functions.

## Index

The optional Supabase table `thesis_locks` that mirrors on-chain events for fast search and feeds. Never authoritative; the chain is.

## Label

Optional freeform text (up to 64 ASCII characters) attached to an anchor. Public, so keep it generic if the title is sensitive.

## Principal

A Stacks account identifier, typically a wallet address beginning with `SP` on mainnet.

## Proof NFT

A SIP-009 token in the `thesislock-proof` contract that represents an anchor and is bound to its minter.

## Proof of existence

A cryptographic demonstration that a specific document existed at or before a point in time, achieved by publishing its hash to an immutable, timestamped ledger.

## Registry

The `thesislock-registry` contract, a per-principal append-only index of a wallet's own anchors.

## SHA-256

The hash function ThesisLock uses. Deterministic, one-way, and collision-resistant.

## SIP-009

The Stacks standard interface for non-fungible tokens, implemented by the proof contract.

## Soulbound

A token that cannot be transferred. Proof NFTs are soulbound; transfer attempts return error `u401`.

## Stacks

A Bitcoin-secured blockchain. ThesisLock's contracts are deployed to Stacks mainnet.

## Stacks Connect

The library the web app uses to connect wallets and request transaction signatures.
