# open-md

Convert a markdown file to a styled HTML page and open it in the browser — one command, no setup.

```bash
npx open-md@latest path/to/file.md
```

`open-md` takes a markdown file, renders it to a complete, self-contained HTML page, and opens it in your default browser. Useful when working with coding agents: let the agent produce markdown (its best format), then read the result as a properly styled document.

## Install & Usage

No install required — run directly with `npx`:

```bash
# Convert and open
npx open-md@latest document.md

# Convert without opening the browser
npx open-md@latest document.md --no-open
```

The HTML is written next to the source file as `document.md.html`.

If you use it often, install globally:

```bash
npm install -g open-md
open-md document.md
```

Give your coding agent this link to set up:

```
https://raw.githubusercontent.com/realtrung/open-md/main/AGENT_SETUP.md
```

## Features

- **GitHub-Flavored Markdown** — tables, task lists, footnotes, strikethrough, autolinks.
- **Syntax highlighting** — fenced code blocks with a language tag are highlighted via highlight.js. Unlabeled blocks render as plain monospace; no false highlights.
- **Math** — inline `$e^{i\pi}+1=0$` and display `$$...$$` equations rendered with KaTeX at page load.
- **Mermaid diagrams** — ` ```mermaid` fences are rendered as graphics in the browser.
- **OS light/dark theme** — follows your system preference automatically. No toggle needed.
- **Print styles** — readable when printed or saved as PDF.

## Output

The generated HTML lives next to the source file:

```
docs/plan.md  →  docs/plan.md.html
```

Each output is a standalone HTML document. Open it in any browser, share it, or commit it alongside the source.

## Known Limitations

- **LaTeX `\\` in matrices** — markdown-it consumes `\\` as an escaped backslash before KaTeX sees it, so matrix row separators collapse to `\`. As a workaround, use `\cr` or `\newline` instead of `\\` inside matrix environments.

## License

MIT
