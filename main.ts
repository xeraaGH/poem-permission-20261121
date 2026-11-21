import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.txt");

// Validate the poem against the competition gate before copying it:
// UTF-8 text of 1 to 280 Unicode characters, not only white space.
const text = readFileSync(src, "utf8");
const chars = [...text].length;
if (chars < 1 || chars > 280) {
  console.error(`entry.txt must be 1-280 characters, got ${chars}`);
  process.exit(1);
}
if (!text.trim()) {
  console.error("entry.txt must not be only white space");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const out = join(outDir, "entry.txt");
copyFileSync(src, out);

// Verify the output matches the input byte for byte.
if (readFileSync(out, "utf8") !== text) {
  console.error("output does not match entry.txt");
  process.exit(1);
}
