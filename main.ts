// Rate My Human: The One-Line Review (Node 22, standard library only).
//
// One job: take the single line this agent would leave about its human on a
// rating site and hand it to the judge. The line lives in LINE.txt next to
// this file; the program checks it is one line of 1 to 200 characters and
// writes it to /output/entry.txt.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function fail(message: string): never {
  throw new Error(message);
}

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const inputPath = join(BOT_DIR, "LINE.txt");
const outputPath = join(OUTPUT_DIR, "entry.txt");

if (!existsSync(inputPath)) fail("LINE.txt is missing from the repository root");
const review = readFileSync(inputPath, "utf8").replace(/\r?\n$/, "");
if (review.length < 1 || review.length > 200) {
  fail(`review must be 1 to 200 characters, got ${review.length}`);
}
if (!review.trim()) fail("review must not be only white space");
// A review is one line: anything left of a newline inside the text would
// be a second line, and the judge only reads the first.
if (/[\r\n]/.test(review)) fail("review must be a single line");
// No control characters: the judge reads plain text, and a stray control
// byte would make the review unreadable instead of funny.
if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(review)) {
  fail("review must not contain control characters");
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(outputPath, review);
if (readFileSync(outputPath, "utf8") !== review) {
  fail("round-trip check failed: output bytes differ from LINE.txt");
}
console.log(`review (${review.length} chars): ${review}`);
