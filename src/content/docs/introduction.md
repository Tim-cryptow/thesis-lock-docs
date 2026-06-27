---
title: Introduction
description: What ThesisLock is, how proof of existence works, why it is built on Stacks and Bitcoin, and the privacy model behind client-side hashing.
---

ThesisLock answers a single question with cryptographic certainty: did this exact document exist at this point in time, and who attested to it? It does so without ever asking you to upload, share, or expose the document itself.

## How proof of existence works

A cryptographic hash function such as SHA-256 maps any input to a fixed 32-byte digest. The mapping is deterministic (the same file always produces the same digest), one-way (you cannot reconstruct the file from the digest), and collision-resistant (you cannot feasibly find two different files with the same digest).

That makes a hash a compact, irreversible fingerprint of a document. If you publish the fingerprint at a known moment and later present a file that produces the same fingerprint, you have proven that the file existed in exactly that form at that moment. ThesisLock publishes that fingerprint to a public blockchain, where the record is timestamped and cannot be altered after the fact.

The flow is:

1. Your browser reads the file and computes its SHA-256 digest locally.
2. You sign a Stacks transaction that writes the digest, plus an optional label, on chain.
3. The transaction is mined into a block, giving the anchor a permanent timestamp.
4. Anyone can re-derive the digest from a copy of the file and confirm it matches the on-chain record.

## Why Stacks and Bitcoin

Stacks is a blockchain that settles its state to Bitcoin. Its consensus anchors to Bitcoin blocks, so once a Stacks transaction is confirmed it inherits the economic finality of the Bitcoin chain. For a timestamping service this matters: the value of a proof of existence is only as strong as the immutability of the ledger it lives on.

ThesisLock records two heights for every anchor: the Stacks block height and the underlying Bitcoin (burn) block height. Either can be checked against public block explorers, so the timestamp does not depend on trusting ThesisLock.

Contracts are written in Clarity, a decidable, non-Turing-complete language whose source is published on chain. Anyone can read exactly what each function does.

## The privacy model

The single most important property is that your document never leaves your device.

- Hashing happens in the browser using the Web Crypto API. The file is read into memory, digested, and discarded. No upload occurs.
- Only the 64-character hex digest and your optional label are sent to the chain.
- A label is freeform text you choose. If you do not want to reveal anything about the document, leave it generic.
- Because SHA-256 is one-way, the on-chain digest reveals nothing about the file's contents.

The practical consequence: you can prove authorship or existence of a confidential thesis, dataset, design, or manuscript without disclosing a single byte of it. Disclosure is your choice, made later, by handing someone the file so they can verify the match themselves.

## What you can build on it

ThesisLock is more than a web app. The same on-chain records are reachable through:

- A read-only [SDK](/reference/sdk/) for TypeScript and JavaScript.
- A [CLI](/reference/cli/) for terminals and scripts.
- A public [REST API](/reference/rest-api/) for any language.
- A [GitHub Action](/reference/github-action/) that gates CI on an anchor.
- [Feeds and webhooks](/reference/feeds-and-webhooks/) for live integrations.

Continue to the [Quickstart](/quickstart/) to anchor and verify your first document, or read [Concepts](/concepts/anchor-types/) for the model behind the five contracts.
