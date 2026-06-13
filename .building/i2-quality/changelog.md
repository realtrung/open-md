# I2 Quality Changelog

## S2 Tailwind Typography

- I2-S2-02 (2026-06-13): Fixed three prose rendering defects. (1) Inline code: stripped Tailwind Typography's backtick pseudo-elements and bold weight; replaced with subtle pill background (rgba highlight, border-radius, normal weight) via `.markdown-body :not(pre) > code` override. (2) Mermaid: reset prose `pre` background/padding on `.mermaid` containers so diagram lines are visible; switched light-mode theme from `default` to `neutral` for GitHub-style rendering; centered diagrams with responsive SVG sizing. (3) Font weight: added `-webkit-font-smoothing: antialiased` to body so macOS renders the system font at intended weight.
- I2-S2-01 (2026-06-13): Replaced hand-rolled typography CSS with @tailwindcss/typography prose styles generated at build time. CSS is shipped as a TS string export and inlined at runtime. Uses prose-gray (light) and prose-invert (dark) via prefers-color-scheme. Layout, task lists, print, and Shiki CSS remain hand-rolled. 38 tests pass.

## S1 Shiki syntax highlighting

- I2-S1-01 (2026-06-13): Replaced CDN highlight.js with Shiki pre-highlighting at convert time. Fenced blocks with explicit language are highlighted via Shiki with dual-theme CSS variables (github-light/github-dark, OS-following). Unlabeled fences render as plain monospace. No CDN script or stylesheet for syntax highlighting remains. Pipeline became async; 37 tests pass.
