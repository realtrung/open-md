# open-md

Convert a markdown file to a readable, good-looking HTML page and open it in the browser — one command, no setup.

```bash
npx open-md@latest path/to/file.md
```

## Problem

- Agents speak markdown: planning, architecture, and design docs are produced as markdown because it is the format agents handle best.
- Humans read poorly in raw markdown: long planning documents are hard to skim and review as plain `.md` text.
- HTML is the right reading surface: a styled HTML page is far easier for a human to consume, but asking the agent to emit HTML directly is wasteful — it burns tokens and is not the agent's strongest format.
- The fix: let the agent output markdown (its best language), then convert that markdown into an aesthetic HTML document for the human to read.

## Who It's For

- Primary: developers working alongside coding agents who need to review agent-produced markdown (plans, designs, architecture notes).
- Secondary: anyone who wants a quick, attractive HTML preview of a markdown file without a static-site generator or editor plugin.

## How It Works

1. Input: the user runs `npx open-md path/to/file.md`.
2. Convert: the tool parses the markdown and renders it to a complete HTML document.
3. Write: the HTML is saved next to the source as `path/to/file.md.html`.
4. Open: the tool opens the generated file in the system default browser.

## Constraints

Distribution:
- Runs via `npx` with no install step and no config file required.
- Zero required arguments beyond the source file path.

Compatibility:
- Targets current Node.js LTS.
- Output opens correctly in current evergreen browsers.

Quality:
- Production-grade from the first release — no "MVP"/"prototype" shortcuts in behavior or output quality.
