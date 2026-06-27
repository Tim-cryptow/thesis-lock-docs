---
title: Calling read-only functions
description: How to call ThesisLock contract read-only functions directly through the Hiro Stacks API, including argument serialization and decoding results.
---

You can read any ThesisLock contract state without the web app, the SDK, or the CLI by calling the Hiro Stacks API directly. This is the lowest-level path and the ultimate fallback: it depends only on Stacks and Hiro.

## The endpoint

The Hiro Stacks API exposes a read-only call endpoint:

```
POST https://api.mainnet.hiro.so/v2/contracts/call-read/{address}/{contract}/{function}
```

- `{address}` is the deployer principal, `SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM`.
- `{contract}` is the contract name, for example `thesislock`.
- `{function}` is the read-only function name, for example `get-anchor`.

The request body is JSON:

```json
{
  "sender": "SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM",
  "arguments": ["0x<clarity-serialized-argument>"]
}
```

Each argument is a hex-encoded, serialized Clarity value. The response is:

```json
{ "okay": true, "result": "0x<clarity-serialized-result>" }
```

The `result` is itself a serialized Clarity value that you decode to get the record.

## Serializing a hash argument

`get-anchor` takes a single `(buff 32)`. A Clarity buffer serializes as the type byte `0x02`, a 4-byte big-endian length, then the raw bytes. For a 32-byte hash the length is `0x00000020`, so the serialized argument is:

```
0x0200000020 + <64 hex characters of the hash>
```

For the hash `9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06` the argument is:

```
0x02000000209afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06
```

The SDK utility `serializeHash` produces exactly this, so you do not have to build it by hand.

## Worked example with curl

```bash
HASH=9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06
ARG="0x0200000020${HASH}"

curl -s -X POST \
  "https://api.mainnet.hiro.so/v2/contracts/call-read/SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM/thesislock/get-anchor" \
  -H "Content-Type: application/json" \
  -d "{\"sender\":\"SP3QS6X01XKTYC84BHA0J567CZTAH67BJHN88FNVM\",\"arguments\":[\"${ARG}\"]}"
```

A non-empty record comes back as `{ "okay": true, "result": "0x..." }` where the result decodes to an `(optional { anchored-by, stacks-block, burn-block, label })`. If the hash was never anchored, the result decodes to `none`.

## Decoding the result

Rather than decode Clarity serialization by hand, use a Stacks library. The `@stacks/transactions` package can deserialize the `result` into a typed Clarity value:

```ts
import { deserializeCV, cvToJSON } from '@stacks/transactions';

const result = '0x...'; // the "result" field from the response
const cv = deserializeCV(result);
console.log(cvToJSON(cv));
```

## Prefer the SDK or CLI when you can

This direct path is useful for languages without a Stacks SDK or for debugging. For everyday use, the [SDK](/reference/sdk/) and [CLI](/reference/cli/) build the arguments and decode the results for you, and the [REST API](/reference/rest-api/) returns plain JSON with no serialization at all.

## Functions you can call

Any `define-read-only` function listed on the contract pages is callable this way, including `get-anchor` and `is-anchored` on `thesislock`, `get-batch-anchor` on `thesislock-batch`, `get-anchor-count` and `get-recent-anchors` on `thesislock-registry`, `get-proof` and `get-token-id-by-hash` on `thesislock-proof`, and `get-group` and `get-recent-group-anchors` on `thesislock-groups`. Match each function's parameter types when serializing arguments.
