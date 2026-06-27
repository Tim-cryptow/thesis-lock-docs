---
title: Scripting and CI
description: Automate anchor checks with the ThesisLock CLI and the GitHub Action, including JSON output, exit codes, and a complete workflow.
---

ThesisLock is built to run in pipelines. The CLI gives you scriptable output and exit codes; the GitHub Action gates a workflow on an on-chain anchor. Both are read-only and need no credentials.

## Scripting with the CLI

Every command supports `--json` for machine-readable output and `--quiet` for a single essential value. The `verify` command also sets its exit code: 0 when anchored, 1 when not.

```bash
# Capture a file's hash
HASH=$(thesislock hash thesis.pdf --quiet)

# Branch on whether it is anchored
if [ "$(thesislock verify "$HASH" --quiet)" = "true" ]; then
  echo "anchored"
else
  echo "not anchored"
  exit 1
fi
```

Combine `--json` with `jq` for richer logic:

```bash
# List files in a directory that are not yet anchored
thesislock batch ./papers --verify --json \
  | jq -r '.[] | select(.anchored == false) | .path'

# Pull the first owner from a label search
thesislock search "thesis draft" --json | jq -r '.[0].owner'
```

Point the CLI at a different Hiro endpoint with `THESISLOCK_API_URL` when you run a proxy or a private node:

```bash
THESISLOCK_API_URL=https://my-hiro-proxy.example.com thesislock status
```

See the full [CLI reference](/reference/cli/).

## Gating CI with the CLI

The simplest CI check installs the CLI and verifies that a published artifact is anchored. Because `hash --verify` and `verify` return a non-zero exit code on failure, a missing anchor fails the job.

```yaml
jobs:
  verify-anchor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install ThesisLock CLI
        run: npm install -g thesislock-cli
      - name: Verify the published whitepaper is anchored
        run: thesislock hash docs/whitepaper.pdf --verify
```

## Gating CI with the GitHub Action

For a declarative check with structured outputs, use the action. It accepts a file path or a precomputed hash, queries the chain, and exposes whether the document is verified along with the anchor's source, block, and label.

```yaml
- id: verify
  uses: Tim-cryptow/thesis-lock/action@main
  with:
    file: ./data/dataset.csv
    fail-on-unverified: "true"
- run: |
    echo "verified: ${{ steps.verify.outputs.verified }}"
    echo "source:   ${{ steps.verify.outputs.source }}"
    echo "block:    ${{ steps.verify.outputs.block }}"
    echo "label:    ${{ steps.verify.outputs.label }}"
```

With `fail-on-unverified` set to `true` (the default), the step fails when the document is not anchored, blocking the pipeline. See the full [GitHub Action reference](/reference/github-action/).

## Choosing between them

- Use the CLI when you want flexible shell logic, JSON piping, or to run outside GitHub.
- Use the Action when you want a clean, declarative step with named outputs inside a GitHub workflow.
