import { md, deriveTitle } from './markdown.js';
import { collectAssets } from './assets.js';
import { htmlDocument } from './html.js';
import { baseCss, typographyCss } from './styles.js';
import { initHighlighter, shikiBaseCss } from './highlight.js';

export interface RenderResult {
  html: string;
  parseMs: number;
}

export async function render(markdown: string): Promise<RenderResult> {
  // Ensure the Shiki highlighter is loaded before markdown-it fires
  // its fence rule (which calls highlightCode synchronously).
  await initHighlighter();

  const t0 = performance.now();
  const body = md.render(markdown);
  const parseMs = performance.now() - t0;

  const assets = collectAssets(body);

  // Base layout + Tailwind Typography prose styles are always included.
  // Shiki CSS is included only when a code block was highlighted.
  const hasHighlightedCode = body.includes('shiki-themes');
  const css = baseCss + typographyCss + (hasHighlightedCode ? shikiBaseCss : '');

  return {
    html: htmlDocument({
      title: md.utils.escapeHtml(deriveTitle(markdown)),
      body,
      assets,
      css,
    }),
    parseMs,
  };
}
