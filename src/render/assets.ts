const MERMAID_VERSION = '11.4.1';
const MERMAID_URL = `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.esm.min.mjs`;

const KATEX_VERSION = '0.16.11';
const KATEX_BASE = `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist`;

// Heuristic: a $$…$$ block or a $…$ inline span. False positives only cost an
// unnecessary asset load; KaTeX auto-render leaves code/pre untouched.
function hasMath(body: string): boolean {
  return /\$\$[\s\S]+?\$\$/.test(body) || /\$[^$\n]+\$/.test(body);
}

export interface Assets {
  head: string[];
  body: string[];
}

// CDN assets are injected only when the rendered body actually uses the feature.
export function collectAssets(body: string): Assets {
  const head: string[] = [];
  const tail: string[] = [];

  // A mermaid container (`<pre class="mermaid">`) emitted by the fence rule.
  if (body.includes('class="mermaid"')) {
    tail.push(
      `<script type="module">import mermaid from '${MERMAID_URL}'; const dark = matchMedia('(prefers-color-scheme: dark)').matches; mermaid.initialize({ startOnLoad: true, theme: dark ? 'dark' : 'neutral' });</script>`,
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
