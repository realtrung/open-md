import { baseCss } from './styles.js';
import type { Assets } from './assets.js';

export function htmlDocument({
  title,
  body,
  assets,
}: {
  title: string;
  body: string;
  assets: Assets;
}): string {
  const headExtra = assets.head.length ? `\n${assets.head.join('\n')}` : '';
  const tailExtra = assets.body.length ? `${assets.body.join('\n')}\n` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${baseCss}</style>${headExtra}
</head>
<body>
<main class="markdown-body">
${body}</main>
${tailExtra}</body>
</html>
`;
}
