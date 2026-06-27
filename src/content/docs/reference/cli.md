---
title: CLI
description: The thesislock-cli command-line tool - install, every command and flag, JSON and quiet output, exit codes, environment variables, and shell completion.
---

`thesislock-cli` brings verification and hashing to the terminal. It runs on Node.js 18 or newer, is read-only, and needs no credentials. Every command supports `--json` and `--quiet` for scripting.

## Install

```bash
# Global install
npm install -g thesislock-cli
thesislock --help

# Without installing
npx thesislock-cli verify <hash>
```

### From source

```bash
cd sdk && npm install && npm run build
cd ../cli && npm install && npm run build
node dist/bin/thesislock.js --help
```

To put it on your PATH from a source checkout:

```bash
cd cli && npm link
```

## Commands

### verify

Validate SHA-256 hash anchors across the ThesisLock contracts.

```bash
thesislock verify 9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06
thesislock verify <hash> --owner SP000...
```

| Flag | Description |
| --- | --- |
| `--owner <principal>` | Also check owner-keyed batch anchors |
| `--json` | Output `{ hash, verified, count, results }` |
| `--quiet` | Print only `true` or `false` |

Exit codes: `0` when anchored, `1` when not anchored. This makes `verify` usable directly in shell conditionals.

### hash

Compute SHA-256 digests for files, optionally checking them on chain.

```bash
thesislock hash thesis.pdf
thesislock hash chapter1.pdf chapter2.pdf chapter3.pdf
thesislock hash thesis.pdf --verify
```

| Flag | Description |
| --- | --- |
| `--verify` | Check each digest against the chain |
| `--json` | Array of `{ file, size, hash, anchored? }` objects |
| `--quiet` | Hash only, one per line |

### status

Display a protocol overview, or statistics for a single wallet.

```bash
thesislock status
thesislock status SPMXTB2P571VMJP2ZG812P2H964S1XVTCDC8QNYX
```

| Flag | Description |
| --- | --- |
| `--json` | Protocol data, or `{ principal, anchors }` for a wallet |
| `--quiet` | `ok`/`unreachable`, or the anchor count for a wallet |

### search

Query anchors by hash, address, or label substring.

```bash
thesislock search "thesis draft"
thesislock search SPMXTB2P571VMJP2ZG812P2H964S1XVTCDC8QNYX
thesislock search 9afe6f57ea2af60478ad37b2d44ae8ede492c4f3b7e70bcc7dfea92128585d06
thesislock search "thesis draft" --json
thesislock search SPMXTB2P571VMJP2ZG812P2H964S1XVTCDC8QNYX --limit 5
```

| Flag | Description |
| --- | --- |
| `--json` | Array of result objects, each with a `verifyUrl` |
| `--quiet` | Matching hashes only |
| `--limit <n>` | Cap results at `n` rows |

### batch

Hash the contents of a directory, optionally checking each file on chain.

```bash
thesislock batch ./papers
thesislock batch ./papers --recursive --exclude "*.log,node_modules"
thesislock batch ./papers --verify
```

| Flag | Description |
| --- | --- |
| `--verify` | Check hashes on chain |
| `--recursive` | Include subdirectories |
| `--exclude <patterns>` | Comma-separated glob patterns to skip |
| `--json` | Array of `{ file, path, size, hash, anchored? }` objects |
| `--quiet` | Hashes only |

## Universal flags

Every command accepts:

- `--json` for machine-readable output.
- `--quiet` for a single essential value, ideal for capturing in a shell variable.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `THESISLOCK_API_URL` | `https://api.mainnet.hiro.so` | Override the Hiro Stacks API base URL |

```bash
THESISLOCK_API_URL=https://my-hiro-proxy.example.com thesislock status
```

## Shell completion

The CLI ships bash and zsh completions.

Bash:

```bash
source /path/to/thesislock-cli/completions/thesislock.bash
# or system-wide:
sudo cp completions/thesislock.bash /usr/share/bash-completion/completions/thesislock
```

Zsh:

```bash
mkdir -p ~/.zsh/completions
cp completions/thesislock.zsh ~/.zsh/completions/_thesislock
# Add to ~/.zshrc before compinit:
# fpath=(~/.zsh/completions $fpath)
# autoload -U compinit && compinit
```

## Scripting examples

Capture values and branch on them:

```bash
HASH=$(thesislock hash thesis.pdf --quiet)
if [ "$(thesislock verify "$HASH" --quiet)" = "true" ]; then
  echo "anchored"
fi
COUNT=$(thesislock status SPMXTB2P571VMJP2ZG812P2H964S1XVTCDC8QNYX --quiet)
```

Pipe JSON into `jq`:

```bash
thesislock batch ./papers --verify --json \
  | jq -r '.[] | select(.anchored == false) | .path'
thesislock search "thesis draft" --json | jq -r '.[0].owner'
```

## CI usage

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

For a declarative alternative with named outputs, see the [GitHub Action](/reference/github-action/).
