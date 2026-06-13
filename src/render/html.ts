import type { Assets } from './assets.js';

export function htmlDocument({
  title,
  body,
  assets,
  css,
}: {
  title: string;
  body: string;
  assets: Assets;
  css: string;
}): string {
  const headExtra = assets.head.length ? `\n${assets.head.join('\n')}` : '';
  const tailExtra = assets.body.length ? `${assets.body.join('\n')}\n` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${css}</style>${headExtra}
</head>
<body>
<main class="markdown-body">
${body}</main>
${tailExtra}</body>
</html>
`;
}
