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

  describe('trusted HTML passthrough', () => {
    it('allows intentional inline HTML through', () => {
      expect(render('<div class="note">hi</div>')).toContain('<div class="note">hi</div>');
    });
  });
});
