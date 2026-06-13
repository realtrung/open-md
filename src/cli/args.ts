import { parseArgs } from 'node:util';

export interface CliArgs {
  file: string | undefined;
  open: boolean;
}

// Parse the argument list after the node binary and script
// (i.e. process.argv.slice(2)) into the file to convert and whether to open it.
export function parseCliArgs(argv: string[]): CliArgs {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'no-open': { type: 'boolean', default: false },
    },
  });

  return {
    file: positionals[0],
    open: !values['no-open'],
  };
}
