import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';

const DEFAULT_TITLE = 'open-md';

export const md = new MarkdownIt({
  // Input is a local file authored by the user/agent (trusted), and docs
  // often contain intentional inline HTML. Deliberate trust assumption.
  html: true,
  linkify: true,
})
  .use(footnote)
  .use(taskLists);

// Mermaid fences become a plain container the browser renders later;
// every other fence keeps markdown-it's default `language-*` class.
const defaultFence = md.renderer.rules.fence!.bind(md.renderer.rules);
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]!;
  if (token.info.trim().toLowerCase() === 'mermaid') {
    return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>\n`;
  }
  return defaultFence(tokens, idx, options, env, self);
};

export function deriveTitle(markdown: string): string {
  const match = markdown.match(/^#[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  return match ? match[1]!.trim() : DEFAULT_TITLE;
}
