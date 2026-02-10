#!/usr/bin/env node
/**
 * CLI entry: accept-md init | doctor | fix-routes
 */

import { createInterface } from 'node:readline';
import { resolve } from 'node:path';
import { runInit, type InitOverrides, runVersionCheck } from './init.js';
import { runDoctor, formatDoctorReport } from './doctor.js';
import { runFixRoutes } from './fix-routes.js';
import { detectProject } from './detect.js';
import { formatSuccessBanner } from './success-banner.js';

const args = process.argv.slice(2);
const command = args[0] || 'help';

function getProjectRoot(): string {
  const positionArgs = args.slice(1).filter((a) => !a.startsWith('--'));
  return resolve(positionArgs[0] || process.cwd());
}

function parseInitArgs(): { projectRoot: string; overrides: InitOverrides } {
  const projectRoot = getProjectRoot();
  const overrides: InitOverrides = {};
  for (const arg of args.slice(1)) {
    if (arg.startsWith('--app-dir=')) overrides.appDir = arg.slice('--app-dir='.length).trim();
    else if (arg.startsWith('--pages-dir=')) overrides.pagesDir = arg.slice('--pages-dir='.length).trim();
    else if (arg.startsWith('--middleware=')) overrides.middlewarePath = arg.slice('--middleware='.length).trim();
  }
  return { projectRoot, overrides };
}

function prompt(question: string, defaultAnswer: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolveAnswer) => {
    const defaultText = defaultAnswer ? ` (default: ${defaultAnswer})` : '';
    rl.question(`${question}${defaultText}: `, (answer) => {
      rl.close();
      resolveAnswer(answer.trim() || defaultAnswer);
    });
  });
}

async function gatherInitOverrides(projectRoot: string, initial: InitOverrides): Promise<InitOverrides> {
  const hasAnyFlag = 'appDir' in initial || 'pagesDir' in initial || 'middlewarePath' in initial;
  if (hasAnyFlag || !process.stdin.isTTY) return initial;

  const detection = detectProject(projectRoot);
  const defaultRoutesDir =
    detection.routerType === 'app' ? (detection.appDir ?? 'app') : (detection.pagesDir ?? 'pages');
  const routesUnderSrc = (detection.appDir ?? detection.pagesDir ?? '').startsWith('src/');
  const middlewareExt = detection.hasTypeScript ? 'ts' : 'js';
  const defaultMiddleware =
    detection.middlewarePath ?? (routesUnderSrc ? `src/middleware.${middlewareExt}` : `middleware.${middlewareExt}`);

  const routesDir = await prompt('App or pages directory', defaultRoutesDir);
  const middlewarePath = await prompt('Middleware file path', defaultMiddleware);

  const overrides: InitOverrides = { ...initial };
  if (detection.routerType === 'app') overrides.appDir = routesDir;
  else overrides.pagesDir = routesDir;
  overrides.middlewarePath = middlewarePath;
  return overrides;
}

async function main() {
  if (command === 'init') {
    const { projectRoot, overrides: initialOverrides } = parseInitArgs();
    const overrides = await gatherInitOverrides(projectRoot, initialOverrides);
    const result = await runInit(projectRoot, Object.keys(overrides).length ? overrides : undefined);
    if (result.ok) {
      console.log(formatSuccessBanner(result.messages));
    } else {
      console.error('Init failed:\n');
      result.messages.forEach((m) => console.error('  ' + m));
      process.exit(1);
    }
    return;
  }

  if (command === 'doctor') {
    const report = await runDoctor(getProjectRoot());
    console.log(formatDoctorReport(report));
    if (report.issues.length) process.exit(1);
    return;
  }

  if (command === 'fix-routes') {
    const result = runFixRoutes(getProjectRoot());
    if (result.patched) console.log(result.message);
    if (!result.ok) {
      console.error(result.message);
      process.exit(1);
    }
    return;
  }

  if (command === 'version-check') {
    const result = await runVersionCheck(getProjectRoot());
    result.messages.forEach((m) => console.log(m));
    if (!result.ok) {
      process.exit(1);
    }
    return;
  }

  console.log(`
accept-md

Usage:
  npx accept-md init [path]      Add markdown middleware to a Next.js project
  npx accept-md doctor [path]    Report routes and check setup
  npx accept-md fix-routes [path] Ensure routes-manifest has dataRoutes (Next.js 15)
  npx accept-md version-check [path] Check version compatibility between CLI and runtime

Init options:
  --app-dir=<path>     App directory (e.g. app or src/app)
  --pages-dir=<path>   Pages directory (e.g. pages or src/pages)
  --middleware=<path>  Middleware file (e.g. middleware.ts or src/middleware.ts)
  path                  Project root (default: current directory)

When run interactively, init will prompt for app/pages and middleware paths; press Enter for defaults.
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
