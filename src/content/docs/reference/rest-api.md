---
title: REST API
description: The ThesisLock REST API - base URL, every endpoint with params and response shapes, the API-key model, and curl, JavaScript, and Python examples.
---

The web app serves a public JSON REST API. The read API is public and unauthenticated, so no key is required to call any endpoint. Verification endpoints resolve against the chain; discovery endpoints read the optional index for speed.

## Base URL

```
https://thesis-lock.vercel.app
```

All paths below are relative to this base.

## Verification

### GET /api/verify/{hash}

Verify a single hash, optionally checking an owner-keyed batch anchor.

Path params:

- `hash` (required) - 64-character hex string.

Query params:

- `owner` (optional) - principal to also check owner-keyed batch anchors.

```bash
curl "https://thesis-lock.vercel.app/api/verify/9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06"
```

Response:

```json
{
  "verified": true,
  "source": "single",
  "hash": "9afe6f57...",
  "label": "project",
  "owner": "SPMXTB2P571VMJP2ZG812P2H964S1XVTCDC8QNYX",
  "stacksBlock": 8104143,
  "burnBlock": 951262,
  "contract": "SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock",
  "verifyUrl": "https://thesis-lock.vercel.app/v/9afe6f57..."
}
```

### POST /api/verify

Verify by JSON body or by uploading a file for server-side hashing.

JSON body:

```json
{ "hash": "9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06" }
```

Multipart body fields:

- `file` (optional) - a file to hash with SHA-256 server-side.
- `owner` (optional) - principal for batch anchor verification.

The response matches `GET /api/verify/{hash}` and adds a `computedHash` field when a file is uploaded.

```bash
# By hash
curl -X POST https://thesis-lock.vercel.app/api/verify \
  -H "Content-Type: application/json" \
  -d '{"hash":"9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06"}'

# By file upload
curl -F "file=@thesis.pdf" https://thesis-lock.vercel.app/api/verify
```

## Search

### GET /api/search

Query params:

- `q` (required) - search term.
- `type` (optional) - `auto` (default), `hash`, `principal`, or `label`.
- `owner` (optional) - principal for batch anchor searches.

Returns a JSON array of results. Each result carries a `source` of `single`, `batch`, `registry`, `proof`, or `group`.

```bash
curl "https://thesis-lock.vercel.app/api/search?q=thesis%20draft&type=label"
```

## Activity

### GET /api/activity

Query params:

- `address` (required) - a Stacks principal.
- `page` (optional) - integer, default `0`.
- `limit` (optional) - integer, default `20`.
- `type` (optional) - one of `anchors`, `groups`, `proofs`, `registry`.

```json
{ "events": [], "total": 0, "hasMore": false }
```

## Profile

### GET /api/profile/{address}

Path params:

- `address` (required) - a Stacks principal.

Returns a wallet profile object. Responds `400` for an invalid address and `502` if the profile cannot be loaded. Responses are cached for 300 seconds.

## Compare

### GET /api/compare

Compare two anchors. At minimum supply two hashes.

Query params:

- `a` (required) - 64-character hex hash.
- `b` (required) - 64-character hex hash.
- `ownerA`, `ownerB` (optional) - principals for batch anchors.
- `groupA` with `giA`, `groupB` with `giB` (optional) - group id and index for group anchors.

```bash
curl "https://thesis-lock.vercel.app/api/compare?a=<hashA>&b=<hashB>"
```

Returns a comparison object, or `400` if two valid hashes are not provided.

## Stats

### GET /api/stats

Returns protocol totals and activity series, including anchor counts, unique wallets, block ranges, and daily data. Cached for five minutes.

```bash
curl "https://thesis-lock.vercel.app/api/stats"
```

## Status and health

### GET /api/health

```json
{
  "status": "ok",
  "contracts": {
    "thesislock": "SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock",
    "batch": "SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock-batch",
    "registry": "SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM.thesislock-registry"
  },
  "version": "1.0.0"
}
```

### GET /api/status

Returns an aggregate service status snapshot:

```json
{ "overall": "ok", "services": [], "timestamp": "2026-06-27T00:00:00.000Z" }
```

Cached for 30 seconds.

## Badges and cards

### GET /api/badge/{hash}

Returns an SVG badge for embedding. Query params: `style=rounded` for a pill shape, `label=Your+Text` for a custom left label, and `owner` for batch anchors.

```md
![Anchored](https://thesis-lock.vercel.app/api/badge/9afe6f57...?style=rounded&label=Anchored)
```

### GET /api/card/{hash}

Returns an Open Graph card image for link previews. Query param: `owner` for batch anchors.

## NFT metadata

### GET /api/nft/{id}

Path params:

- `id` (required) - integer proof token id.

Returns NFT metadata and an SVG image for the proof token.

## Feeds and webhooks

The API also serves RSS, Atom, and JSON feeds and supports signed webhooks. These have their own page: [Feeds and Webhooks](/reference/feeds-and-webhooks/).

## The API-key model

The read API is public and unauthenticated, so a key is not required to call any endpoint. The developer portal can generate optional keys for your own tracking and scoping:

- Keys have the form `tl_` followed by 32 hex characters and are generated client-side with `crypto.getRandomValues`.
- In lists they display masked, as the `tl_` prefix plus the first six and last four characters.
- Keys support scoped permissions mapped to API surfaces: `verify`, `search`, `stats`, `badges`, `profiles`, and `compare`.
- Keys are generated and stored entirely in your browser's local storage under `thesislock_api_keys`. This is an MVP convenience; for production, validate keys server-side.

No rate-limit tiers are documented; several endpoints set cache headers (for example `stats` for five minutes, `profile` for 300 seconds, `status` for 30 seconds), so prefer caching responses over tight polling.

## Cross-language examples

curl:

```bash
curl "https://thesis-lock.vercel.app/api/verify/9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06"
```

JavaScript (fetch):

```js
const hash = '9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06';
const res = await fetch(`https://thesis-lock.vercel.app/api/verify/${hash}`);
const data = await res.json();
console.log(data.verified, data.label, data.stacksBlock);
```

Python (requests):

```python
import requests

hash = "9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06"
res = requests.get(f"https://thesis-lock.vercel.app/api/verify/{hash}")
data = res.json()
print(data["verified"], data.get("label"), data.get("stacksBlock"))
```
