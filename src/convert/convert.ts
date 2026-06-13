import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { render } from '../render/render.js';

// The HTML is written beside the source: design.md -> design.md.html.
export function outputPathFor(inputPath: string): string {
  return `${inputPath}.html`;
}

// Read a markdown file, render it, and write the HTML next to the source.
// Returns the output path. Throws a clear error for unusable input.
export async function convertFile(inputPath: string): Promise<string> {
  if (!/\.md$/i.test(inputPath)) {
    throw new Error(`open-md: not a .md file: ${inputPath}`);
  }

  let stat;
  try {
    stat = statSync(inputPath);
  } catch {
    throw new Error(`open-md: file not found: ${inputPath}`);
  }
  if (stat.isDirectory()) {
    throw new Error(`open-md: path is a directory, not a file: ${inputPath}`);
  }

  const outputPath = outputPathFor(inputPath);
  writeFileSync(outputPath, await render(readFileSync(inputPath, 'utf8')), 'utf8');
  return outputPath;
}
