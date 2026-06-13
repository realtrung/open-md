# I1 Foundation Changelog

## S1 Core conversion pipeline

- I1-S1-02 (2026-06-13): `npx open-md <file.md>` reads the file, writes the rendered `<file>.md.html` beside it, and opens it in the default browser; `--no-open` skips launching. Missing, non-`.md`, and directory inputs fail with a clear message and exit 1. Args via `node:util.parseArgs`; browser launch via a per-platform spawn, no dependency.
- I1-S1-01 (2026-06-13): Markdown source renders to a complete, styled HTML document — core GFM (tables, task lists, strikethrough, autolinks), footnotes, inlined base CSS, and a title from the first H1. Fenced code carries a language class and mermaid fences emit a container, ready for S2 to render.

## Setup

- (2026-06-13): Repo toolchain bootstrapped — TypeScript (compiled with `tsc`), vitest (test runner), prettier (formatting), changesets (versioning), and GitHub Actions CI (install → format check → typecheck → test → build). Toolchain runs green. Done as chore work ahead of the first RGR cycle; not a slice.
