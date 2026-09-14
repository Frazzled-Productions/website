#!/usr/bin/env node
// Fails if anything in the repo contradicts .nvmrc, which is the home of record for the
// required Node major (see AGENTS.md). Run locally with `npm run check:node-version`, and
// in CI before the install step.
//
// This exists because issue #14: the major used to live only as a `node-version: '20'`
// literal inside a CI step, so nothing stated what the repo actually wanted and CI could
// silently validate a different runtime from the one Vercel built with.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const nvmrc = readFileSync(".nvmrc", "utf8").trim();
if (!/^\d+$/.test(nvmrc)) {
  console.error(`.nvmrc must hold a bare major version, found "${nvmrc}".`);
  process.exit(1);
}

const errors = [];

// Vercel picks the build runtime from engines.node, and npm warns on a local mismatch,
// so package.json has to restate .nvmrc exactly.
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const engines = pkg.engines?.node;
if (engines !== `${nvmrc}.x`) {
  errors.push(
    `package.json engines.node is ${JSON.stringify(engines)}, expected "${nvmrc}.x" to match .nvmrc.`,
  );
}

// @types/node majors track Node majors, so type-checking against a different one describes
// a runtime this repo does not run.
const nodeTypes = pkg.devDependencies?.["@types/node"];
if (nodeTypes !== `^${nvmrc}`) {
  errors.push(
    `package.json devDependencies["@types/node"] is ${JSON.stringify(nodeTypes)}, expected "^${nvmrc}" to match .nvmrc.`,
  );
}

// Workflows must derive the major from .nvmrc rather than repeat it.
const workflowDir = join(".github", "workflows");
for (const file of readdirSync(workflowDir)) {
  if (!file.endsWith(".yml") && !file.endsWith(".yaml")) continue;
  const path = join(workflowDir, file);
  readFileSync(path, "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (line.includes("node-version:")) {
        errors.push(
          `${path}:${index + 1} hardcodes a node-version literal; use "node-version-file: .nvmrc" instead.`,
        );
      }
    });
}

// The README is where someone cloning the repo looks first, so it must not disagree either.
const readmeMajors = [
  ...readFileSync("README.md", "utf8").matchAll(/Node\.js (\d+)/g),
].map((match) => match[1]);
if (readmeMajors.length === 0) {
  errors.push('README.md does not state the required major (expected prose reading "Node.js <major>").');
}
for (const major of readmeMajors) {
  if (major !== nvmrc) {
    errors.push(`README.md says Node.js ${major}, expected ${nvmrc} to match .nvmrc.`);
  }
}

if (errors.length > 0) {
  console.error("Node version drift detected:");
  for (const error of errors) console.error(`  - ${error}`);
  console.error(".nvmrc is the home of record, so change the files listed above to agree with it.");
  process.exit(1);
}

console.log(`Node major ${nvmrc} is stated consistently in .nvmrc, package.json, the workflows and README.md.`);
