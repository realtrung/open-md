# open-md

## 0.3.1

### Patch Changes

- 9b0e08a: Inline code styling changed from background pill to amber colored text.

## 0.3.0

### Minor Changes

- fdb5c86: `render()` now returns `{ html, parseMs }` and `convertFile()` returns `{ outputPath, parseMs }`. The CLI prints parse time to stderr after each conversion.

## 0.2.0

### Minor Changes

- 9d89cf2: - Replace CDN highlight.js with Shiki pre-highlighting (dual-theme, OS-following via CSS variables)
  - Replace hand-rolled typography CSS with @tailwindcss/typography generated at build time
  - Fix inline code pill styling, Mermaid diagram visibility, and macOS font smoothing
  - Fix heading anchor links

## 0.1.0

### Minor Changes

- Initial release: markdown to HTML conversion with syntax highlighting, KaTeX math, Mermaid diagrams, and OS-aware light/dark theming.
