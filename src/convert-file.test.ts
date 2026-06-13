import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { convertFile, outputPathFor } from './convert-file.js';

function tmp(): string {
  return mkdtempSync(join(tmpdir(), 'open-md-'));
}

describe('outputPathFor', () => {
  it('appends .html to the source path', () => {
    expect(outputPathFor('/a/b/design.md')).toBe('/a/b/design.md.html');
  });
});

describe('convertFile', () => {
  it('writes <file>.md.html beside the source with rendered HTML', () => {
    const dir = tmp();
    try {
      const input = join(dir, 'doc.md');
      writeFileSync(input, '# Title\n\nhello');
      const out = convertFile(input);
      expect(out).toBe(join(dir, 'doc.md.html'));
      const html = readFileSync(out, 'utf8');
      expect(html).toContain('<title>Title</title>');
      expect(html).toContain('<h1>Title</h1>');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('throws for a non-.md file', () => {
    const dir = tmp();
    try {
      const input = join(dir, 'notes.txt');
      writeFileSync(input, 'x');
      expect(() => convertFile(input)).toThrow(/\.md/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('throws when the file does not exist', () => {
    expect(() => convertFile('/no/such/file.md')).toThrow(/not found/i);
  });

  it('throws when the path is a directory', () => {
    const dir = tmp();
    try {
      const sub = join(dir, 'sub.md');
      mkdirSync(sub);
      expect(() => convertFile(sub)).toThrow(/director/i);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
