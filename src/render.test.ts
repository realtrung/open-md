import { describe, it, expect } from 'vitest';
import { render } from './render.js';

describe('render', () => {
  describe('document shell', () => {
    it('produces a full HTML5 document', () => {
      const html = render('# Hello');
      expect(html).toMatch(/^<!doctype html>/i);
      expect(html).toContain('<html');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
      expect(html).toContain('</html>');
    });

    it('inlines a base stylesheet in the head', () => {
      expect(render('# Hello')).toMatch(/<style>[\s\S]+<\/style>/);
    });

    it('derives the document title from the first H1', () => {
      expect(render('# My Document\n\nbody')).toMatch(/<title>My Document<\/title>/);
    });

    it('falls back to a default title when there is no H1', () => {
      expect(render('just text')).toMatch(/<title>open-md<\/title>/);
    });
  });

  describe('core GFM', () => {
    it('renders headings', () => {
      expect(render('# Title')).toContain('<h1>Title</h1>');
    });

    it('renders unordered lists', () => {
      const html = render('- one\n- two');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>one</li>');
    });

    it('renders GFM tables', () => {
      const html = render('| a | b |\n| - | - |\n| 1 | 2 |');
      expect(html).toContain('<table>');
      expect(html).toContain('<th>a</th>');
      expect(html).toContain('<td>1</td>');
    });

    it('renders task lists with checkboxes', () => {
      const html = render('- [x] done\n- [ ] todo');
      expect(html).toContain('type="checkbox"');
      expect(html).toContain('checked');
    });

    it('renders footnotes', () => {
      expect(render('Here[^1]\n\n[^1]: the note')).toContain('footnote');
    });

    it('renders strikethrough', () => {
      expect(render('~~gone~~')).toContain('<s>gone</s>');
    });

    it('autolinks bare URLs', () => {
      expect(render('see https://example.com here')).toContain('<a href="https://example.com"');
    });
  });

  describe('hooks for later slices', () => {
    it('tags fenced code with its language class', () => {
      expect(render('```js\nconst x = 1;\n```')).toContain('language-js');
    });

    it('emits a mermaid container for mermaid fences', () => {
      const html = render('```mermaid\ngraph TD; A-->B;\n```');
      expect(html).toContain('class="mermaid"');
      expect(html).toContain('A--&gt;B');
    });
  });

  describe('syntax highlighting assets', () => {
    it('injects highlight.js when a fenced code block is present', () => {
      const html = render('```js\nconst x = 1;\n```');
      expect(html).toContain('highlight.js');
      expect(html).toContain('hljs.highlightAll()');
      expect(html).toContain('language-js');
    });

    it('does not inject highlight.js when there is no code block', () => {
      const html = render('# Just prose\n\nno code here');
      expect(html).not.toContain('highlight.js');
      expect(html).not.toContain('hljs');
    });

    it('does not inject highlight.js for a mermaid-only document', () => {
      const html = render('```mermaid\ngraph TD; A-->B;\n```');
      expect(html).toContain('class="mermaid"');
      expect(html).not.toContain('highlight.js');
    });
  });

  describe('mermaid assets', () => {
    it('injects mermaid when a mermaid block is present', () => {
      const html = render('```mermaid\ngraph TD; A-->B;\n```');
      expect(html).toContain('mermaid.initialize');
      expect(html).toContain('mermaid@');
    });

    it('does not inject mermaid without a mermaid block', () => {
      const html = render('# prose\n\n```js\nconst x = 1;\n```');
      expect(html).not.toContain('mermaid.initialize');
    });
  });

  describe('trusted HTML passthrough', () => {
    it('allows intentional inline HTML through', () => {
      expect(render('<div class="note">hi</div>')).toContain('<div class="note">hi</div>');
    });
  });
});
