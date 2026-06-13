import { spawn } from 'node:child_process';

export interface OpenCommand {
  command: string;
  args: string[];
}

// Resolve the platform-specific command that opens a path in the default app.
export function openCommand(platform: NodeJS.Platform, target: string): OpenCommand {
  if (platform === 'darwin') {
    return { command: 'open', args: [target] };
  }
  if (platform === 'win32') {
    // `start` needs an (empty) title argument before the target.
    return { command: 'cmd', args: ['/c', 'start', '', target] };
  }
  return { command: 'xdg-open', args: [target] };
}

// Open the target in the default browser, detached so the CLI can exit.
export function openInBrowser(target: string): void {
  const { command, args } = openCommand(process.platform, target);
  spawn(command, args, { detached: true, stdio: 'ignore' }).unref();
}
