# I2 Quality Changelog

## S2 Tailwind Typography

## S1 Shiki syntax highlighting

- I2-S1-01 (2026-06-13): Replaced CDN highlight.js with Shiki pre-highlighting at convert time. Fenced blocks with explicit language are highlighted via Shiki with dual-theme CSS variables (github-light/github-dark, OS-following). Unlabeled fences render as plain monospace. No CDN script or stylesheet for syntax highlighting remains. Pipeline became async; 37 tests pass.
