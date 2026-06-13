# I1 Foundation Changelog

## S3 Theming and polish

- I1-S3-02 (2026-06-13): Added print styles — full-width content and break-inside avoidance for code, tables, images, and blockquotes so the page prints/saves to PDF cleanly. Completes S3 and I1.
- I1-S3-01 (2026-06-13): The rendered page follows the OS light/dark preference — base colors flip under `prefers-color-scheme`, highlight.js pairs light/`github-dark` themes, and mermaid initializes with a matching theme.

## S2 Rich rendering

- I1-S2-03 (2026-06-13): `$…$` and `$$…$$` math renders with KaTeX auto-render (`throwOnError:false`), injected from a pinned CDN only when the document appears to contain math. Completes S2.
- I1-S2-02 (2026-06-13): ` ```mermaid ` blocks render as diagrams — the mermaid ESM module and `mermaid.initialize` are injected from a pinned CDN only when the document contains a mermaid block.
- I1-S2-01 (2026-06-13): Fenced code blocks are syntax-highlighted with highlight.js, injected from a pinned CDN only when the document contains code. Establishes the conditional-asset seam that mermaid and math reuse.

## S1 Core conversion pipeline

- I1-S1-02 (2026-06-13): `npx open-md <file.md>` reads the file, writes the rendered `<file>.md.html` beside it, and opens it in the default browser; `--no-open` skips launching. Missing, non-`.md`, and directory inputs fail with a clear message and exit 1. Args via `node:util.parseArgs`; browser launch via a per-platform spawn, no dependency.
- I1-S1-01 (2026-06-13): Markdown source renders to a complete, styled HTML document — core GFM (tables, task lists, strikethrough, autolinks), footnotes, inlined base CSS, and a title from the first H1. Fenced code carries a language class and mermaid fences emit a container, ready for S2 to render.

## Setup

- (2026-06-13): Repo toolchain bootstrapped — TypeScript (compiled with `tsc`), vitest (test runner), prettier (formatting), changesets (versioning), and GitHub Actions CI (install → format check → typecheck → test → build). Toolchain runs green. Done as chore work ahead of the first RGR cycle; not a slice.
