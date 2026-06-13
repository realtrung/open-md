#!/usr/bin/env node
import { resolve } from 'node:path';
import { parseCliArgs } from './args.js';
import { convertFile } from '../convert/convert.js';
import { openInBrowser } from '../open/open.js';

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function main(argv: string[]): void {
  const { file, open } = parseCliArgs(argv);
  if (!file) {
    fail('open-md: missing input file\nusage: open-md <file.md> [--no-open]');
  }

  let outputPath: string;
  try {
    outputPath = convertFile(resolve(file));
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  console.log(outputPath);
  if (open) {
    openInBrowser(outputPath);
  }
}

main(process.argv.slice(2));
