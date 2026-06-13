# S1 Shiki — Design

## Goal

Replace CDN-loaded highlight.js with server-side Shiki at convert time. No `<script>` for highlighting, no browser-side language auto-detection, VS Code-quality grammar matching, dual-theme CSS variables for OS-following light/dark.

## What Changes

### Dependencies

- Add: `shiki` (v3.x).
- Remove: none (highlight.js is CDN-only; already has no npm dep).

### Async pipeline

Shiki requires a one-time async init to load themes and grammars. The render entry point becomes async.

- `render()`: signature `string` → `Promise<string>`.
- `convertFile()`: signature `string` → `Promise<string>`.
- `cli.ts` `main()`: becomes async (`await convertFile(…)`).
- `index.ts`: the public `render` export is now async — callers must `await`.
- Tests: every `render(…)` call becomes `await render(…)`.

The async shift is purely internal plumbing. No CLI flag or behavioral change results.

### Shiki highlighter

- One highlighter instance, lazy-created on first `render()` call, cached module-level.
- Created via `createHighlighter` with:
  - Themes: `github-light`, `github-dark`.
  - Langs: a curated set of ~20 common languages (js, ts, py, rs, go, bash, json, yaml, dockerfile, etc.). Load-all is avoided to keep the package slim.
- Each fenced block with a recognized language gets highlighted via `codeToHtml`.
- Dual theme via Shiki's `themes: { light, dark }` option with `defaultColor: false`.
- Output: HTML with inline `style="color:var(--shiki-token-…)"` — no hardcoded colors.
- Shiki returns the CSS variable definitions alongside the highlighted HTML. These are collected once and injected into the base stylesheet.

### Fence renderer rule (`src/render/markdown.ts`)

- Blocks with an explicit language: call Shiki. The Shiki output replaces the markdown-it default fence HTML.
- Blocks without language info (` ``` ` alone): render as plain `<pre><code>` — no highlighting.
- Mermaid blocks: unchanged from I1 (still emit `<pre class="mermaid">`).

### Assets cleanup (`src/render/assets.ts`)

- Remove: highlight.js CSS `<link>` injection and the `hljs.highlightAll()` script + `<script src>` .
- Keep: Mermaid and KaTeX CDN injection logic (unchanged).
- Detection guard: the `body.includes('<pre><code')` check is removed; Shiki output is already highlighted.

### Styles (`src/render/styles.ts`)

- Append Shiki-generated CSS variable definitions to `baseCss`.
- The Shiki CSS defines light values under `:root` and dark values under `@media (prefers-color-scheme: dark) { :root { … } }`.
- Existing `--code-bg` and other variables stay unchanged — Shiki tokens use their own set of variables (`--shiki-*`).
- Existing `pre` and `code` styles remain; they define the container look (background, padding, border-radius, font) while Shiki handles token-level coloring.

### HTML document (`src/render/html.ts`)

- Signature change: accept an optional `shikiCss: string` property alongside `assets`, or fold Shiki CSS into the base stylesheet upstream.
- Decision: fold into `styles.ts` upstream, not in `html.ts`. `htmlDocument` stays unchanged except the `baseCss` it includes already has Shiki variables.

## Scope

IN:
- Server-side highlighting via Shiki at convert time.
- VS Code-quality grammar matching for ~20 common languages.
- Dual-theme CSS variables — light/dark follows OS preference, no CDN link.
- Unlabeled fences render as plain monospace (correct; no false highlights).
- Existing Mermaid and KaTeX CDN injection unchanged.

OUT:
- Custom themes beyond GitHub light/dark.
- Loading grammars on demand or at user request.
- Any new CLI flags.
- Changes to Mermaid or KaTeX integration.

## Risks

- **Async gap**: `render()` was sync and is a public export. Any external caller using `render` directly breaks at the type level. Mitigation: the package is an application, not a library — the only real callers are `convertFile` and tests. Both are under our control.
- **Grammar scope**: we preload ~20 languages. A markdown file with a fence in a missing language gets no highlighting (falls back to plain `<pre><code>`). This is acceptable per the exit criterion — unlabeled blocks get no highlighting; unrecognized languages behave the same.
- **Shiki output size**: highlighted HTML contains many inline `style` attributes, which can bloat output. Mitigation: this is the cost of server-side pre-highlighting; the alternative (CDN script) has different costs (runtime dependency, flash of unstyled code). The trade-off is correct per the goal.

## Verification

Existing tests in `src/render/index.test.ts` that assert on highlight.js CDN content must be rewritten. New assertions:
- A fenced block with a recognized language produces Shiki-style `var(--shiki-…)` token spans.
- An unlabeled fence produces plain `<pre><code>` with no `var(--shiki-…)`.
- The base stylesheet includes Shiki CSS variable definitions for light and dark.
- No highlight.js CDN URL appears anywhere in the output.
- Mermaid and KaTeX injection still works (regression check).
- `convertFile` still writes, throws for non-.md, missing files, and directories (regression check).
