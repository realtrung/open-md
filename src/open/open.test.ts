import { describe, it, expect } from 'vitest';
import { openCommand } from './open.js';

describe('openCommand', () => {
  it('uses open on macOS', () => {
    expect(openCommand('darwin', '/tmp/x.html')).toEqual({
      command: 'open',
      args: ['/tmp/x.html'],
    });
  });

  it('uses cmd start on Windows', () => {
    expect(openCommand('win32', 'C:\\x.html')).toEqual({
      command: 'cmd',
      args: ['/c', 'start', '', 'C:\\x.html'],
    });
  });

  it('uses xdg-open elsewhere', () => {
    expect(openCommand('linux', '/tmp/x.html')).toEqual({
      command: 'xdg-open',
      args: ['/tmp/x.html'],
    });
  });
});
