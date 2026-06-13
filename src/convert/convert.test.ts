import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { convertFile, outputPathFor } from './convert.js';

function tmp(): string {
  return mkdtempSync(join(tmpdir(), 'open-md-'));
}

describe('outputPathFor', () => {
  it('appends .html to the source path', () => {
    expect(outputPathFor('/a/b/design.md')).toBe('/a/b/design.md.html');
  });
});

describe('convertFile', () => {
  it('writes <file>.md.html beside the source with rendered HTML', async () => {
    const dir = tmp();
    try {
      const input = join(dir, 'doc.md');
      writeFileSync(input, '# Title\n\nhello');
      const out = await convertFile(input);
      expect(out).toBe(join(dir, 'doc.md.html'));
      const html = readFileSync(out, 'utf8');
      expect(html).toContain('<title>Title</title>');
      expect(html).toMatch(/<h1[^>]*id="title"[^>]*>Title<\/h1>/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('throws for a non-.md file', async () => {
    const dir = tmp();
    try {
      const input = join(dir, 'notes.txt');
      writeFileSync(input, 'x');
      await expect(convertFile(input)).rejects.toThrow(/\.md/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('throws when the file does not exist', async () => {
    await expect(convertFile('/no/such/file.md')).rejects.toThrow(/not found/i);
  });

  it('throws when the path is a directory', async () => {
    const dir = tmp();
    try {
      const sub = join(dir, 'sub.md');
      mkdirSync(sub);
      await expect(convertFile(sub)).rejects.toThrow(/director/i);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
