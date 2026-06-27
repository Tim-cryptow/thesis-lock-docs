---
title: GitHub Action
description: The ThesisLock verify Action - inputs, outputs, default behavior, and a complete example workflow that gates CI on an on-chain anchor.
---

The ThesisLock Action gates a CI pipeline on an on-chain anchor. It accepts a file path or a precomputed hash, queries the chain read-only through the Hiro mainnet API, and exposes the result as step outputs. It needs no credentials.

## Usage

```yaml
- uses: Tim-cryptow/thesis-lock/action@main
  with:
    file: ./data/dataset.csv
```

Reference the action by the `action` subdirectory of the product repository. Pin to a tag or commit SHA for reproducible builds.

## Inputs

| Input | Required | Default | Description |
| --- | --- | --- | --- |
| `hash` | No | (none) | A precomputed 64-character hex hash to verify |
| `file` | No | (none) | A path to a file to hash and verify |
| `owner` | No | (none) | A principal for owner-keyed batch anchors |
| `fail-on-unverified` | No | `true` | Fail the step when the document is not anchored |

Provide either `file` or `hash`. When both are given, `file` takes precedence: the action hashes the file and verifies that digest.

## Outputs

| Output | Description |
| --- | --- |
| `verified` | Boolean string indicating on-chain verification status |
| `source` | Anchor type: `single`, `batch`, `proof`, or `group` |
| `block` | Stacks block number containing the anchor |
| `label` | The label attached to the anchor |

## Default behavior

With `fail-on-unverified` at its default of `true`, the step fails when the document is not anchored, which blocks the workflow. Set it to `"false"` to record the result without failing, then branch on the `verified` output yourself.

## Complete example

```yaml
name: Verify anchor
on: [push]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: verify
        uses: Tim-cryptow/thesis-lock/action@main
        with:
          file: ./data/dataset.csv
          fail-on-unverified: "false"

      - run: |
          echo "verified: ${{ steps.verify.outputs.verified }}"
          echo "source:   ${{ steps.verify.outputs.source }}"
          echo "block:    ${{ steps.verify.outputs.block }}"
          echo "label:    ${{ steps.verify.outputs.label }}"

      - name: Block on missing anchor
        if: steps.verify.outputs.verified != 'true'
        run: |
          echo "dataset.csv is not anchored on chain"
          exit 1
```

## Gating versus reporting

- To hard-gate a pipeline, leave `fail-on-unverified` at `true` and let the step fail. This is the simplest correct setup for release pipelines.
- To report without blocking, set `fail-on-unverified: "false"` and consume the outputs in later steps, as above.

## When to prefer the CLI

The Action is the cleanest choice inside a GitHub workflow because of its named outputs. If you need shell logic, JSON piping, or to run outside GitHub, use the [CLI](/reference/cli/) instead. Both query the same chain read-only.
