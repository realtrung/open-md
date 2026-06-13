import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';
import { highlightCode } from './highlight.js';

const DEFAULT_TITLE = 'open-md';

export const md = new MarkdownIt({
  // Input is a local file authored by the user/agent (trusted), and docs
  // often contain intentional inline HTML. Deliberate trust assumption.
  html: true,
  linkify: true,
})
  .use(footnote)
  .use(taskLists)
  .use(anchor, {
    slugify: (s: string) =>
      s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // strip punctuation — GitHub keeps only alphanum, spaces, hyphens
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, ''),
  });

md.renderer.rules.fence = (tokens, idx, _options, _env, _self) => {
  const token = tokens[idx]!;
  const lang = token.info.trim().toLowerCase();

  if (lang === 'mermaid') {
    return `<pre class="mermaid">${md.utils.escapeHtml(token.content)}</pre>\n`;
  }

  // Explicit language: try Shiki. Fall back to plain on failure.
  if (lang) {
    const highlighted = highlightCode(token.content, lang);
    if (highlighted) return highlighted + '\n';
  }

  // Unlabeled fence or unrecognized language: plain monospace.
  return `<pre><code>${md.utils.escapeHtml(token.content)}</code></pre>\n`;
};

export function deriveTitle(markdown: string): string {
  const match = markdown.match(/^#[ \t]+(.+?)[ \t]*#*[ \t]*$/m);
  return match ? match[1]!.trim() : DEFAULT_TITLE;
}
