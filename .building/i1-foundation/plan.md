# I1 Foundation Plan

## I1 Goal

Ship the working v1 of `open-md`: a human can run one command on an agent's markdown file and immediately read a clean, well-formatted HTML page — code, math, and diagrams all rendered.

## Preconditions

Repo toolchain set up as chore work before the first RGR cycle (not a slice):
- Language: TypeScript, compiled to JS with `tsc` (no bundler) for distribution.
- Test runner: vitest — runs `.ts` directly; required before any RED step.
- Formatting: prettier — formatting baseline before code lands.
- Versioning: changesets — release/version management.
- CI: GitHub Actions — install → format check → typecheck → test → build on every push/PR.

## Slice Status

- [x] [S1 Core conversion pipeline](#s1-goal)
- [.] [S2 Rich rendering](#s2-goal)
- [ ] [S3 Theming and polish](#s3-goal)

## Scope

IN:
- Single-file markdown → HTML conversion.
- GFM core, syntax highlighting, KaTeX math, Mermaid diagrams.
- Open in default browser, with a `--no-open` opt-out.
- Light/dark theming that follows the OS preference.

OUT (for now):
- Watch mode / live reload.
- Multi-file or directory conversion, or site/index generation.
- Fully offline self-contained output (assets are CDN-referenced).
- Custom user themes or per-document branding.
- Markdown linting, editing, or authoring features.

## Markdown Support

The converter targets a full, modern markdown feature set.

Core (GFM):
- CommonMark plus GitHub-flavored extensions.
- Tables, task lists, strikethrough, autolinks, footnotes.

Rich content:
- Syntax highlighting: fenced code blocks are highlighted by language.
- Math: inline `$...$` and block `$$...$$` LaTeX rendered with KaTeX.
- Diagrams: ` ```mermaid ` fenced blocks rendered as flowcharts, sequence diagrams, etc.

## CLI Behavior

- Usage: `npx open-md@latest <file.md> [options]`.
- Default: convert, write `<file>.md.html`, then open it in the default browser.
- `--no-open`: convert and write the file but do not launch the browser (for scripts and agent use).
- Theme: the page ships with light and dark styling and follows the OS color-scheme preference automatically.

## Output

- Location: written beside the source file as `<source>.md.html` (e.g. `design.md` → `design.md.html`).
- Single file: each run produces one standalone `.html` document.
- Assets: styling and feature libraries (syntax highlighting, math, diagrams) are referenced from public CDNs via `<link>`/`<script>` tags — the file is a single HTML file but is not offline-capable.
- Base styling: typography and layout CSS are inlined so the document is readable the moment it loads, before any CDN asset arrives.
- Overwrite: re-running on the same source overwrites the previous `.md.html`.

## Exit Criteria

- A human can run one command on an agent's markdown file and immediately read a clean, well-formatted page.
- Code, math, and diagrams render correctly without manual steps.
- Agents can generate the HTML non-interactively with `--no-open` and hand the path to the human.

## S1 Goal

Stand up the full convert-and-open pipeline for core markdown. `npx open-md <file.md>` reads the file, renders core GFM to a complete, styled HTML document, writes it beside the source as `<file>.md.html`, and opens it in the default browser; `--no-open` skips launching. Basic input errors (missing file, not a `.md`) are handled clearly.

## S2 Goal

Render rich content. Fenced code blocks are syntax-highlighted, `$...$`/`$$...$$` math renders via KaTeX, and ` ```mermaid ` blocks render as diagrams — all client-side from CDN assets, pulled in only when the document actually uses each feature.

## S3 Goal

Make it pleasant to read. Light and dark themes that follow the OS color-scheme preference, plus refined typography and print styling. Closes I1 toward a publishable first release.
