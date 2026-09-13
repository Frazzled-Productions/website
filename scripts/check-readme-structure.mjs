// Checks the README's "Project structure" block against what is actually on disk.
//
// That block had gone stale three times over (the favicon, then analytics, then the
// donation button) before issue #16 caught it, because nothing ever compared it to the
// repository. This does, in both directions:
//
//   1. every path the block names must exist, so a deleted file cannot linger in the text
//      (this is what would have caught the `public/` line listing assets nobody used);
//   2. every file under app/ must be named in the block, so a new component cannot be
//      added without documenting it.
//
// Run via `npm run check:structure`.

import { readFileSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const readmePath = path.join(repoRoot, 'README.md');
const documentedRoot = 'app';

/** Pulls the fenced block that follows the `## Project structure` heading. */
function readStructureBlock() {
  const readme = readFileSync(readmePath, 'utf8');
  const match = readme.match(/^## Project structure\s*\n+```\n([\s\S]*?)\n```/m);
  if (!match) {
    throw new Error(
      'Could not find a fenced block under "## Project structure" in README.md. ' +
        'If the section was renamed or reformatted, update this script to match.',
    );
  }
  return match[1];
}

/**
 * Turns the indented tree into repository-relative paths. Indentation is two spaces per
 * level and a trailing slash marks a directory, so `    Typewriter.tsx` two levels under
 * `app/` and `components/` becomes `app/components/Typewriter.tsx`.
 */
function parseTree(block) {
  const paths = [];
  const stack = [];

  for (const line of block.split('\n')) {
    if (!line.trim()) continue;

    const indent = line.length - line.trimStart().length;
    if (indent % 2 !== 0) {
      throw new Error(`Tree line is not indented by a multiple of two spaces: "${line}"`);
    }

    const depth = indent / 2;
    const name = line.trim().split(/\s+/)[0];
    stack.length = depth;
    stack.push(name.replace(/\/$/, ''));

    paths.push({ path: stack.join('/'), isDirectory: name.endsWith('/') });
  }

  return paths;
}

/** Every file and directory under `dir`, as repository-relative paths. */
async function walk(dir) {
  const found = [];
  for (const entry of await readdir(path.join(repoRoot, dir))) {
    const relative = `${dir}/${entry}`;
    found.push(relative);
    if ((await stat(path.join(repoRoot, relative))).isDirectory()) {
      found.push(...(await walk(relative)));
    }
  }
  return found;
}

const documented = parseTree(readStructureBlock());
const problems = [];

// 1. Nothing documented that is not there.
for (const entry of documented) {
  const asWritten = entry.isDirectory ? `${entry.path}/` : entry.path;
  let stats;
  try {
    stats = await stat(path.join(repoRoot, entry.path));
  } catch {
    problems.push(`${asWritten} is in the README tree but does not exist`);
    continue;
  }
  if (stats.isDirectory() !== entry.isDirectory) {
    problems.push(
      entry.isDirectory
        ? `${entry.path} has a trailing slash in the README tree but is a file`
        : `${entry.path} is a directory, so it needs a trailing slash in the README tree`,
    );
  }
}

// 2. Nothing in app/ that is not documented.
const documentedPaths = new Set(documented.map((entry) => entry.path));
for (const found of await walk(documentedRoot)) {
  if (!documentedPaths.has(found)) {
    problems.push(`${found} exists but is missing from the README tree`);
  }
}

if (problems.length > 0) {
  console.error('README "Project structure" block is out of date:\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error('\nUpdate the block in README.md so it matches the repository.');
  process.exit(1);
}

console.log(`README "Project structure" block matches ${documentedRoot}/.`);
