import { md, deriveTitle } from './markdown.js';
import { collectAssets } from './assets.js';
import { htmlDocument } from './html.js';

export function render(markdown: string): string {
  const body = md.render(markdown);
  return htmlDocument({
    title: md.utils.escapeHtml(deriveTitle(markdown)),
    body,
    assets: collectAssets(body),
  });
}
