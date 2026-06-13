import { describe, it, expect } from 'vitest';
import { parseCliArgs } from './args.js';

describe('parseCliArgs', () => {
  it('takes the file as a positional and opens by default', () => {
    expect(parseCliArgs(['doc.md'])).toEqual({ file: 'doc.md', open: true });
  });

  it('disables opening with --no-open', () => {
    expect(parseCliArgs(['doc.md', '--no-open'])).toEqual({ file: 'doc.md', open: false });
  });

  it('reports no file when none is given', () => {
    expect(parseCliArgs([])).toEqual({ file: undefined, open: true });
  });

  it('accepts --no-open before the file', () => {
    expect(parseCliArgs(['--no-open', 'doc.md'])).toEqual({ file: 'doc.md', open: false });
  });
});
