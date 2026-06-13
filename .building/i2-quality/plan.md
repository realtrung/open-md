# I2 Quality Plan

## I2 Goal

Raise output quality beyond I1's working baseline. Replace CDN-loaded highlight.js with Shiki running at convert time, and replace the hand-rolled CSS with Tailwind Typography — producing more accurate syntax highlighting, a more polished reading experience, and fewer runtime CDN dependencies.

## Slice Status

- [ ] [S1 Shiki syntax highlighting](#s1-goal)
- [ ] [S2 Tailwind Typography](#s2-goal)

## Scope

IN:
- Server-side syntax highlighting via Shiki — no CDN `<script>`, no browser-side auto-detection, VS Code-quality grammar matching.
- Tailwind Typography prose styles replacing the hand-rolled `src/render/styles.ts` CSS.
- Dual-theme (light/dark, OS-following) preserved across both changes.

OUT:
- Watch mode / live reload.
- Offline-capable Mermaid and KaTeX (still CDN-referenced).
- Custom user themes or per-document branding.
- Any new CLI flags or behavioral changes.

## Exit Criteria

- Fenced code blocks with an explicit language render with VS Code-quality highlighting and no false highlights on unlabeled blocks.
- Prose typography matches the quality and coverage of Tailwind Typography defaults.
- Light/dark switching still follows the OS preference with no user action.
- No CDN asset is loaded for syntax highlighting.
- The page is immediately readable before any remaining CDN assets (Mermaid, KaTeX) arrive.

## S1 Goal

Replace CDN highlight.js with Shiki. Highlighting runs at convert time in Node.js — no `<script>` tag injected, no browser-side language auto-detection. Only fenced blocks with an explicit language declaration are highlighted; unlabeled fences render as plain monospace. Dual-theme output preserves OS-following light/dark switching without media-scoped CDN stylesheet links.

## S2 Goal

Replace the hand-rolled CSS in `src/render/styles.ts` with Tailwind Typography (`@tailwindcss/typography`). The generated prose CSS is produced at build time and inlined into the HTML `<head>` — the page remains immediately readable before any CDN asset arrives. OS-following dark mode is preserved.
