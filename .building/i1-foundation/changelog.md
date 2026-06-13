# I1 Foundation Changelog

## S1 Core conversion pipeline

- I1-S1-01 (2026-06-13): Markdown source renders to a complete, styled HTML document — core GFM (tables, task lists, strikethrough, autolinks), footnotes, inlined base CSS, and a title from the first H1. Fenced code carries a language class and mermaid fences emit a container, ready for S2 to render.

## Setup

- (2026-06-13): Repo toolchain bootstrapped — TypeScript (compiled with `tsc`), vitest (test runner), prettier (formatting), changesets (versioning), and GitHub Actions CI (install → format check → typecheck → test → build). Toolchain runs green. Done as chore work ahead of the first RGR cycle; not a slice.
