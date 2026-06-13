# I2 Quality Changelog

## S2 Tailwind Typography

- I2-S2-01 (2026-06-13): Replaced hand-rolled typography CSS with @tailwindcss/typography prose styles generated at build time. CSS is shipped as a TS string export and inlined at runtime. Uses prose-gray (light) and prose-invert (dark) via prefers-color-scheme. Layout, task lists, print, and Shiki CSS remain hand-rolled. 38 tests pass.

## S1 Shiki syntax highlighting

- I2-S1-01 (2026-06-13): Replaced CDN highlight.js with Shiki pre-highlighting at convert time. Fenced blocks with explicit language are highlighted via Shiki with dual-theme CSS variables (github-light/github-dark, OS-following). Unlabeled fences render as plain monospace. No CDN script or stylesheet for syntax highlighting remains. Pipeline became async; 37 tests pass.
