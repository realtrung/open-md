import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';
import { baseCss } from './styles.js';

const DEFAULT_TITLE = 'open-md';

const md = new MarkdownIt({
  // Input is a local file authored by the user/agent (trusted), and docs
  // often contain intentional inline HTML. Deliberate trust assumption.
  html: true,
  linkify: true,
})
  .use(footnote)
  .use(taskLists);

// Mermaid fences become a plain container the browser renders later (S2);
// every other fence keeps markdown-it's default `language-*` class.
const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules);
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!;
  if (token.info.trim().toLowerCase() === 'mermaid') {
    return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>\n`;
  }
  return defaultFence(tokens, idx, options, env, self);
};

// Title comes from the first level-1 heading, falling back to a default.
function deriveTitle(markdown: string): string {
  const match = markdown.match(/^#[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  return match ? match[1]!.trim() : DEFAULT_TITLE;
}

function htmlDocument({ title, body }: { title: string; body: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>${baseCss}</style>
</head>
<body>
<main class="markdown-body">
${body}</main>
</body>
</html>
`;
}

// Render markdown source text into a complete, styled HTML document string.
export function render(markdown: string): string {
  return htmlDocument({
    title: md.utils.escapeHtml(deriveTitle(markdown)),
    body: md.render(markdown),
  });
}
