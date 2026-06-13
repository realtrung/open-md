import { createHighlighter, type Highlighter } from 'shiki';

const LANGS = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'rust',
  'go',
  'bash',
  'shell',
  'json',
  'yaml',
  'toml',
  'html',
  'css',
  'scss',
  'sql',
  'xml',
  'java',
  'c',
  'cpp',
  'csharp',
  'ruby',
  'php',
  'diff',
  'markdown',
  'dockerfile',
];

let hl: Highlighter | null = null;

export async function initHighlighter(): Promise<void> {
  if (!hl) {
    hl = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: LANGS,
    });
  }
}

// Return highlighted HTML for a code block, or null if the language
// is not recognized (caller falls back to plain <pre><code>).
export function highlightCode(code: string, lang: string): string | null {
  if (!hl) return null;
  try {
    return hl.codeToHtml(code, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });
  } catch {
    return null;
  }
}

// CSS that makes Shiki dual-theme output follow OS preference.
// Spans carry --shiki-light / --shiki-dark inline custom properties;
// these rules switch which set is used based on prefers-color-scheme.
export const shikiBaseCss = `
.shiki-themes {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}
.shiki-themes span {
  color: var(--shiki-light);
}
@media (prefers-color-scheme: dark) {
  .shiki-themes {
    color: var(--shiki-dark);
    background-color: var(--shiki-dark-bg);
  }
  .shiki-themes span {
    color: var(--shiki-dark);
  }
}`;
