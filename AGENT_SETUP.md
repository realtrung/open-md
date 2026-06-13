# open-md — Agent Setup Guide

After writing a `.md` file, run this command so the user can read it as a clean, readable document instead of raw markdown:

```bash
npx --yes open-md@latest document.md
```

The `--yes` flag skips the install prompt. The HTML is written next to the source as `document.md.html` and opened in the user's default browser.

If `open-md` is already installed globally, use the shorter form:

```bash
open-md document.md
```

## Setup options

To make this automatic going forward, pick one of the following.

### 1. AGENTS.md or CLAUDE.md snippet

Add this line to the repo's `AGENTS.md` (or `CLAUDE.md` for Claude Code):

```
After writing or creating a .md file, run `npx --yes open-md@latest <file>` so the user can read it as a clean, readable document.
```

### 2. Automatic hook

Add this to `.claude/settings.json` in the repo. It fires after every file write, so you won't need to remember to run the command manually:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r '.tool_input.file_path // empty'); [[ \"$FILE\" == *.md ]] && npx --yes open-md@latest \"$FILE\" || true"
          }
        ]
      }
    ]
  }
}
```

> On headless or CI environments, append `--no-open` to skip launching the browser and only generate the HTML file.

> Add `*.md.html` to the repo's `.gitignore` to avoid committing generated files.
