import { md, deriveTitle } from './markdown.js';
import { collectAssets } from './assets.js';
import { htmlDocument } from './html.js';
import { baseCss, typographyCss } from './styles.js';
import { initHighlighter, shikiBaseCss } from './highlight.js';

export async function render(markdown: string): Promise<string> {
  // Ensure the Shiki highlighter is loaded before markdown-it fires
  // its fence rule (which calls highlightCode synchronously).
  await initHighlighter();

  const body = md.render(markdown);
  const assets = collectAssets(body);

  // Base layout + Tailwind Typography prose styles are always included.
  // Shiki CSS is included only when a code block was highlighted.
  const hasHighlightedCode = body.includes('shiki-themes');
  const css = baseCss + typographyCss + (hasHighlightedCode ? shikiBaseCss : '');

  return htmlDocument({
    title: md.utils.escapeHtml(deriveTitle(markdown)),
    body,
    assets,
    css,
  });
}
