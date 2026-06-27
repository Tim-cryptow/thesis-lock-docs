---
title: Troubleshooting
description: Common ThesisLock problems and how to resolve them, across the web app, CLI, SDK, REST API, and contracts.
---

## Web app

### My wallet will not connect

Make sure a supported extension is installed and unlocked: Leather, Xverse, or Asigna. Refresh the page after unlocking. If multiple wallet extensions are enabled, disable the ones you are not using to avoid conflicts.

### My anchor is stuck as pending

Anchoring is a Stacks transaction and is not a proof until it is mined. Wait for confirmation; the app updates the status automatically. If it stays pending for a long time, the network may be congested or the fee may be low. Check the transaction on the [Hiro Explorer](https://explorer.hiro.so).

### Anchoring failed with "already anchored"

The single-anchor contract rejects a hash that already has a record (error `u100`). That document is already anchored. Verify it at `/v/<hash>` instead of anchoring again.

### A new anchor does not show up in search

Verification is immediate, but search and feeds read the optional index, which can lag slightly behind the chain. Verify directly at `/v/<hash>` or with `GET /api/verify/{hash}`; it will confirm immediately even when search has not caught up.

## CLI

### command not found: thesislock

The global install did not place the binary on your PATH. Reinstall with `npm install -g thesislock-cli`, or run without installing via `npx thesislock-cli ...`, or link a source checkout with `npm link` from the `cli` directory.

### verify exits non-zero in my script

That is by design: `verify` exits `0` when anchored and `1` when not, so the document you checked is not anchored. Use `--quiet` and compare the printed `true`/`false` if you want to handle both cases without the exit code stopping your script.

### The CLI cannot reach the network

By default it calls `https://api.mainnet.hiro.so`. If that host is blocked, set `THESISLOCK_API_URL` to a reachable Hiro endpoint or proxy.

## SDK

### verify returns verified: false for a hash I know is anchored

Check the anchor type. `verify` only checks the single-anchor contract. For a batch anchor, call `verifyBatch(hash, owner)` or `verifyAny(hash, owner)` with the owning principal, since batch records are keyed by hash and owner.

### A method rejected with a network error

Read methods reject their promise on network or API failure rather than returning a value. Wrap calls in `try`/`catch` and retry or surface the error. An absent record is not an error; it returns `verified: false` or `null`.

## REST API

### I get a 400 from /api/verify

Confirm the hash is exactly 64 hexadecimal characters. For batch anchors, add `?owner=<principal>`.

### compare returns 400

`GET /api/compare` requires two valid 64-hex hashes as `a` and `b`. Group comparisons also need the matching `group` and index parameters.

## Contracts

### A group action returns u403

`u403` covers two cases in `thesislock-groups`. From `add-member` or `remove-member` it means you are not the group admin. From `anchor-to-group` it means you are not a member of that group.

### A transfer of my proof NFT fails

Proof NFTs are soulbound. Every transfer returns `u401` by design; the token is permanently bound to the wallet that minted it.

## Still stuck

Open an issue on the [product repository](https://github.com/Tim-cryptow/thesis-lock/issues) with the steps to reproduce, the hash or transaction id, and what you expected.
