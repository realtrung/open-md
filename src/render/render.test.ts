import { describe, it, expect } from 'vitest';
import { render } from './render.js';

describe('render', () => {
  describe('document shell', () => {
    it('produces a full HTML5 document', async () => {
      const html = await render('# Hello');
      expect(html).toMatch(/^<!doctype html>/i);
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
    });

    it('inlines a base stylesheet in the head', async () => {
      expect(await render('# Hello')).toMatch(/<style>[\s\S]+<\/style>/);
    });

    it('derives the document title from the first H1', async () => {
      expect(await render('# My Document\n\nbody')).toMatch(/<title>My Document<\/title>/);
    });

    it('falls back to a default title when there is no H1', async () => {
      expect(await render('just text')).toMatch(/<title>open-md<\/title>/);
    });
  });

  describe('core GFM', () => {
    it('renders headings', async () => {
      expect(await render('# Title')).toContain('<h1>Title</h1>');
    });

    it('renders unordered lists', async () => {
      const html = await render('- one\n- two');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>one</li>');
    });

    it('renders GFM tables', async () => {
      const html = await render('| a | b |\n| - | - |\n| 1 | 2 |');
      expect(html).toContain('<table>');
      expect(html).toContain('<th>a</th>');
      expect(html).toContain('<td>1</td>');
    });

    it('renders task lists with checkboxes', async () => {
      const html = await render('- [x] done\n- [ ] todo');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
    });

    it('renders footnotes', async () => {
      expect(await render('Here[^1]\n\n[^1]: the note')).toContain('footnote');
    });

    it('renders strikethrough', async () => {
      expect(await render('~~gone~~')).toContain('<s>gone</s>');
    });

    it('autolinks bare URLs', async () => {
      expect(await render('see https://example.com here')).toContain('<a href="https://example.com"');
    });
  });

  describe('fenced code blocks', () => {
    it('highlights a block with an explicit language via Shiki', async () => {
      const html = await render('```js\nconst x = 1;\n```');
      // Shiki dual-theme output uses CSS variables for token colors.
      expect(html).toMatch(/var\(--shiki-/);
    });

    it('renders an unlabeled fence as plain monospace with no Shiki spans', async () => {
      const html = await render('```\nplain code\nno language\n```');
      expect(html).toContain('<pre><code>');
      expect(html).not.toMatch(/var\(--shiki-/);
    });

    it('does not inject any CDN asset for syntax highlighting', async () => {
      const html = await render('```js\nconst x = 1;\n```');
      expect(html).not.toContain('highlight.js');
      expect(html).not.toContain('hljs.highlightAll');
    });

    it('emits a mermaid container for mermaid fences', async () => {
      const html = await render('```mermaid\ngraph TD; A-->B;\n```');
      expect(html).toContain('class="mermaid"');
      expect(html).toContain('A--&gt;B');
    });
  });

  describe('mermaid assets', () => {
    it('injects mermaid when a mermaid block is present', async () => {
      const html = await render('```mermaid\ngraph TD; A-->B;\n```');
      expect(html).toContain('mermaid.initialize');
      expect(html).toContain('mermaid@');
    });

    it('does not inject mermaid without a mermaid block', async () => {
      const html = await render('# prose\n\n```js\nconst x = 1;\n```');
      expect(html).not.toContain('mermaid.initialize');
    });
  });

  describe('math (KaTeX) assets', () => {
    it('injects KaTeX when inline math is present', async () => {
      const html = await render('Euler: $e^{i\\pi}+1=0$.');
      expect(html).toContain('katex');
      expect(html).toContain('renderMathInElement');
    });

    it('injects KaTeX for display math', async () => {
      expect(await render('$$\\int_0^1 x\\,dx$$')).toContain('renderMathInElement');
    });

    it('does not inject KaTeX without math', async () => {
      const html = await render('# prose\n\njust text, no math');
      expect(html).not.toContain('katex');
      expect(html).not.toContain('renderMathInElement');
    });
  });

  describe('typography styles', () => {
    it('inlines Tailwind Typography prose styles', async () => {
      const html = await render('# Hello\n\nparagraph');
      // Tailwind Typography injects --tw-prose-* custom properties.
      expect(html).toContain('--tw-prose');
    });
  });

  describe('theming (OS dark mode)', () => {
    it('declares an OS-following color scheme with a dark block', async () => {
      const html = await render('# x');
      expect(html).toContain('color-scheme: light dark');
      expect(html).toContain('prefers-color-scheme: dark');
    });

    it('includes Shiki CSS variable definitions for light and dark themes', async () => {
      const html = await render('```js\nconst x = 1;\n```');
      // Shiki injects CSS variables scoped to light and dark OS preferences.
      expect(html).toContain('--shiki-');
      expect(html).toContain('prefers-color-scheme: dark');
    });

    it('initializes mermaid with an OS-aware theme', async () => {
      const html = await render('```mermaid\ngraph TD; A-->B;\n```');
      expect(html).toContain('mermaid.initialize');
      expect(html).toMatch(/matchMedia[\s\S]*theme/);
    });

    it('includes print styles that avoid breaking blocks across pages', async () => {
      const html = await render('# x');
      expect(html).toContain('@media print');
      expect(html).toContain('break-inside: avoid');
    });
  });

  describe('trusted HTML passthrough', () => {
    it('allows intentional inline HTML through', async () => {
      expect(await render('<div class="note">hi</div>')).toContain('<div class="note">hi</div>');
    });
  });
});
