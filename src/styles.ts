// Base typography and layout for the rendered document. Inlined into the
// HTML <head> so the page is readable the moment it loads. Light theme only;
// dark mode and OS-preference theming arrive in S3.
export const baseCss = `
:root {
  color-scheme: light;
  --fg: #1f2328;
  --muted: #59636e;
  --bg: #ffffff;
  --border: #d1d9e0;
  --code-bg: #f6f8fa;
  --link: #0969da;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
}
main.markdown-body {
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1.5rem 6rem;
}
h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin: 2rem 0 1rem; font-weight: 600; }
h1 { font-size: 2rem; padding-bottom: 0.3em; border-bottom: 1px solid var(--border); }
h2 { font-size: 1.5rem; padding-bottom: 0.3em; border-bottom: 1px solid var(--border); }
h3 { font-size: 1.25rem; }
p, ul, ol, blockquote, table, pre { margin: 0 0 1rem; }
a { color: var(--link); text-decoration: none; }
a:hover { text-decoration: underline; }
blockquote {
  margin-left: 0;
  padding: 0 1rem;
  color: var(--muted);
  border-left: 0.25rem solid var(--border);
}
code {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.875em;
  background: var(--code-bg);
  padding: 0.2em 0.4em;
  border-radius: 6px;
}
pre {
  background: var(--code-bg);
  padding: 1rem;
  border-radius: 6px;
  overflow: auto;
}
pre code { background: none; padding: 0; font-size: 0.875em; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid var(--border); padding: 0.4rem 0.75rem; }
th { background: var(--code-bg); }
img { max-width: 100%; }
hr { border: 0; border-top: 1px solid var(--border); margin: 2rem 0; }
.task-list-item { list-style: none; }
.task-list-item input { margin: 0 0.4em 0 -1.4em; }
`;
