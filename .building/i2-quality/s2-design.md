# S2 Tailwind Typography — Design

## Goal

Replace the hand-rolled typography CSS in `src/render/styles.ts` with `@tailwindcss/typography`. The prose CSS is generated at build time and inlined — no CDN dependency, page immediately readable. OS-following dark mode preserved.

## What Changes

### Dependencies

- Add (dev): `tailwindcss`, `@tailwindcss/typography`.
- Remove: none.

### Build pipeline

Tailwind is a build-time tool — the generated CSS is shipped as a static string, not a runtime dependency.

- New script or build step that invokes Tailwind to produce a minimal CSS file containing only typography styles.
- The output is wrapped as a TypeScript string export (e.g., `export const typographyCss = "…"`).
- `tsc` compiles it into `dist/` alongside the rest of the code.
- `npm run build` runs Tailwind generation before `tsc`.

### What gets replaced vs. kept

The current `baseCss` string mixes layout, theming, typography, and print styles. After S2, `styles.ts` composes the full CSS from several sources:

**Replaced by Tailwind Typography** (generated `typographyCss`):
- Headings (`h1`–`h6`): sizes, weights, margins, bottom borders.
- Paragraphs, lists, blockquotes: margins, spacing, link colors, blockquote border.
- Tables: borders, padding, header background.
- Inline code: font, background, padding, border-radius.
- Code blocks (`pre`): background, padding, border-radius, overflow.
- Images: max-width.
- Horizontal rules.

**Kept as hand-rolled CSS:**
- Layout: `body` background/font, `main.markdown-body` max-width + centering + padding.
- `:root` CSS custom properties (still used for layout colors, though typography colors come from Tailwind).
- Task list styles (not covered by the typography plugin).
- Print styles.
- Shiki CSS variable rules (already in `highlight.ts`).

### Tailwind config

- `darkMode: 'media'` — uses `@media (prefers-color-scheme: dark)` for dark mode, matching our OS-following approach.
- `corePlugins: { preflight: false }` — no CSS reset; our output is a simple `<main>` wrapper.
- Plugin: `@tailwindcss/typography`.
- Color: `prose-gray` (light) / `prose-invert` (dark).

### CSS input

A minimal Tailwind input file that applies `prose` and `prose-invert` to `.markdown-body`:

```css
.markdown-body {
  @apply prose prose-gray max-w-none;
}
@media (prefers-color-scheme: dark) {
  .markdown-body {
    @apply prose-invert;
  }
}
```

`max-w-none` disables Tailwind Typography's default `max-width` — we set our own on the container.

### Shiki interaction

Shiki-highlighted blocks (`<pre class="shiki-themes">`) carry inline background and text colors via CSS variables. The prose styles won't affect them because inline styles take precedence. Unhighlighted blocks (`<pre><code>`) fall through to prose styling — correct, they should look like the rest of the document.

### Scope

IN:
- Generate typography CSS via Tailwind at build time, inline at runtime.
- Replace all typography rules currently in `baseCss`.
- `prose-gray` light mode, `prose-invert` dark mode via `prefers-color-scheme`.
- Shiki and Mermaid/KaTeX CDN injection unchanged.

OUT:
- Runtime Tailwind JIT or CDN.
- Tailwind utility classes in the HTML output.
- Removing or replacing layout/print/task-list CSS.
- New CLI flags or behavioral changes.

## Risks

- **Tailwind version churn**: we pin `tailwindcss` and `@tailwindcss/typography` to specific versions. Build-time generation means upgrades are controlled.
- **Generated CSS size**: Tailwind Typography output is larger than the current hand-rolled CSS (~12KB vs ~2KB). Mitigation: the trade-off is quality and coverage — Tailwind covers more elements, more edge cases, and is battle-tested. The CSS is inlined and gzip-friendly.
- **`@apply` in media queries**: Tailwind v3 warns against `@apply` in `@media` blocks for JIT efficiency but it works. We use `tailwindcss` CLI which handles this. If issues arise, alternative: generate two separate CSS blocks (light prose, dark prose-invert).
- **Task lists and footnotes**: markdown-it plugins generate specific markup that Tailwind Typography may not style. We keep the existing hand-rolled rules for these if the generated prose CSS doesn't cover them.

## Verification

- Tests in `render.test.ts` that assert on specific CSS content must be updated (e.g., explicit heading sizes, border styles).
- The document shell test (`produces a full HTML5 document`, `inlines a base stylesheet`) stays.
- The theming test (`declares an OS-following color scheme`) stays.
- Existing typography tests should assert that prose classes/styles are present rather than specific hand-rolled values.
- Mermaid, KaTeX, Shiki tests remain unchanged.
- `convertFile` tests remain unchanged.
