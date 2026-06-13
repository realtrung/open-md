import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';
import { baseCss } from './styles.js';

const DEFAULT_TITLE = 'open-md';

const HLJS_VERSION = '11.10.0';
const HLJS_BASE = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/${HLJS_VERSION}`;

const MERMAID_VERSION = '11.4.1';
const MERMAID_URL = `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs`;

const KATEX_VERSION = '0.16.11';
const KATEX_BASE = `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist`;

// Heuristic: a $$…$$ block or a $…$ inline span. False positives only cost an
// unnecessary asset load; KaTeX auto-render leaves code/pre untouched.
function hasMath(body: string): boolean {
  return /\$\$[\s\S]+?\$\$/.test(body) || /\$[^$\n]+\$/.test(body);
}

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

interface Assets {
  head: string[];
  body: string[];
}

// CDN assets are injected only when the rendered body actually uses the
// feature. Later S2 tasks (mermaid, katex) add their own branches here.
function collectAssets(body: string): Assets {
  const head: string[] = [];
  const tail: string[] = [];

  // A fenced code block (`<pre><code`) — but not a mermaid container.
  if (body.includes('<pre><code')) {
    head.push(
      `<link rel="stylesheet" href="${HLJS_BASE}/styles/github.min.css" media="(prefers-color-scheme: light)">`,
      `<link rel="stylesheet" href="${HLJS_BASE}/styles/github-dark.min.css" media="(prefers-color-scheme: dark)">`,
    );
    tail.push(
      `<script src="${HLJS_BASE}/highlight.min.js"></script>`,
      `<script>hljs.highlightAll();</script>`,
    );
  }

  // A mermaid container (`<pre class="mermaid">`) emitted by the fence rule.
  if (body.includes('class="mermaid"')) {
    tail.push(
      `<script type="module">import mermaid from '${MERMAID_URL}'; const dark = matchMedia('(prefers-color-scheme: dark)').matches; mermaid.initialize({ startOnLoad: true, theme: dark ? 'dark' : 'default' });</script>`,
    );
  }

  // KaTeX renders $…$ / $$…$$ found anywhere in the document body.
  if (hasMath(body)) {
    head.push(`<link rel="stylesheet" href="${KATEX_BASE}/katex.min.css">`);
    tail.push(
      `<script defer src="${KATEX_BASE}/katex.min.js"></script>`,
      `<script defer src="${KATEX_BASE}/contrib/auto-render.min.js"></script>`,
      `<script>document.addEventListener("DOMContentLoaded",function(){renderMathInElement(document.body,{delimiters:[{left:"$$",right:"$$",display:true},{left:"$",right:"$",display:false}],throwOnError:false});});</script>`,
    );
  }

  return { head, body: tail };
}

function htmlDocument({
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

// Render markdown source text into a complete, styled HTML document string.
export function render(markdown: string): string {
  const body = md.render(markdown);
  return htmlDocument({
    title: md.utils.escapeHtml(deriveTitle(markdown)),
    body,
    assets: collectAssets(body),
  });
}
