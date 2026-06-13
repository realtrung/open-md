# I3 Fixes Changelog

## S1 Fixes

- I3-S1-01 (2026-06-13): CLI now prints parse time to stderr (`parsed in Xms`) after each conversion. `render()` returns `{ html, parseMs }` and `convertFile()` returns `{ outputPath, parseMs }`; tests updated accordingly.
