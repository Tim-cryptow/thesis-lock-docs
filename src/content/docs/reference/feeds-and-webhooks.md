---
title: Feeds and Webhooks
description: ThesisLock feeds (RSS, Atom, JSON Feed) and webhooks - endpoints, filters, event types, payloads, and HMAC-SHA256 signature verification.
---

ThesisLock offers two ways to follow anchoring activity: pull-based feeds you poll, and push-based webhooks that call your endpoint. Both read from the optional index described in [On-chain truth vs the index](/concepts/on-chain-vs-index/).

## Feeds

Three feed formats are available, all under `/api/feed`:

| Format | Endpoint | Content type |
| --- | --- | --- |
| RSS 2.0 | `GET /api/feed/rss` | `application/rss+xml` |
| Atom 1.0 | `GET /api/feed/atom` | `application/atom+xml` |
| JSON Feed 1.1 | `GET /api/feed/json` | `application/feed+json` |

### Filters

All three accept the same query parameters:

| Parameter | Purpose |
| --- | --- |
| `contract` | Filter by contract, for example `batch`, `groups`, `proof`, or `thesislock-batch` |
| `address` | Filter by wallet principal |
| `limit` | Limit results; maximum `100`, default `50` |

### Examples

```bash
# All recent activity as RSS
curl "https://thesis-lock.vercel.app/api/feed/rss"

# Groups contract, 20 most recent, as Atom
curl "https://thesis-lock.vercel.app/api/feed/atom?contract=groups&limit=20"

# A single wallet's activity as JSON Feed
curl "https://thesis-lock.vercel.app/api/feed/json?address=SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM"
```

Pages include `<link rel="alternate">` autodiscovery tags, so feed readers can find the RSS and Atom feeds automatically.

## Webhooks

Webhooks push a signed JSON payload to your endpoint when activity occurs, so you do not have to poll. Manage subscriptions and send test payloads from the developer portal; the signing secret is shown once when you create a subscription.

### Event types

| Event | Fires when |
| --- | --- |
| `anchor.created` | A single document is anchored |
| `batch.created` | A batch of documents is anchored |
| `group.anchor` | A document is anchored to a group |
| `proof.minted` | A proof NFT is minted |
| `group.created` | A new group is created |
| `group.member_added` | A member is added to a group |

### Payload

```json
{
  "event": "anchor.created",
  "data": {
    "hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "label": "Thesis final draft",
    "owner": "SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM",
    "txId": "0x9f1e...eeff0",
    "stacksBlock": 168420
  },
  "timestamp": "2026-06-21T15:00:00.000Z"
}
```

### Verifying the signature

Each delivery includes a signature header:

- Header: `X-ThesisLock-Signature`
- Format: `sha256=<hex>`
- Algorithm: HMAC-SHA256 of the raw request body, keyed by the subscription's signing secret

Compute the same value over the raw body and compare in constant time. Always hash the raw bytes, not a re-serialized object.

Node.js:

```js
import crypto from 'node:crypto';

function isValid(rawBody, signatureHeader, secret) {
  const expected =
    'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signatureHeader),
    Buffer.from(expected)
  );
}
```

Python:

```python
import hmac
import hashlib

def is_valid(raw_body: bytes, signature_header: str, secret: str) -> bool:
    expected = "sha256=" + hmac.new(
        secret.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature_header, expected)
```

## Transaction confirmation webhook (experimental)

Separately, an experimental endpoint notifies a URL when a specific transaction confirms.

### POST /api/webhook

```json
{
  "url": "https://example.com/hooks/thesislock",
  "txId": "0x<64-hex-tx-id>"
}
```

When the transaction confirms, ThesisLock posts to your `url`:

```json
{ "txId": "0x<64-hex-tx-id>", "status": "success", "blockHeight": 8104143 }
```

Constraints: the `url` must be public HTTPS (loopback and private addresses are rejected), and `txId` must be a 32-byte hex value. Delivery is best-effort and in-memory, with no retry guarantee, so treat this endpoint as experimental and not for critical paths. For durable activity notifications, prefer the signed event webhooks above.
