# Planet CSV Parser

## Installation

1. Ensure you have Deno installed: https://deno.land/
2. In the terminal, run: `deno run --allow-read mod.ts`

## Buffering

- Buffering is just holding onto the data for a little bit before using it.
- Instead of sending data back, bite by bite as it's being read, we send back, for example, a whole line of data at a time.
