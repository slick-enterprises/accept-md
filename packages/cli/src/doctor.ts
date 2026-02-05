/**
 * Doctor command: report detected routes, conflicts, and suggestions.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { detectProject } from './detect.js';
import { scanProject, loadConfig, type DoctorReport } from '@accept-md/core';

export function runDoctor(projectRoot: string): DoctorReport {
  const detected = detectProject(projectRoot);
  const { routes } = scanProject(projectRoot, {
    appDir: detected.appDir ?? undefined,
    pagesDir: detected.pagesDir ?? undefined,
  });
  const conflicts: string[] = [];
  const issues: string[] = [];
  const suggestions: string[] = [];

  if (!detected.isNext) {
    issues.push('Not a Next.js project.');
    return { detected, routes: [], conflicts, issues, suggestions };
  }

  if (!detected.routerType) {
    issues.push('No app/ or pages/ directory found.');
  }

  if (detected.middlewarePath) {
    const content = readFileSync(join(projectRoot, detected.middlewarePath), 'utf-8');
    if (!content.includes('accept-md')) {
      suggestions.push('Middleware exists but markdown rewrite not detected. Run `npx accept-md init` to add it.');
    }
  } else {
    suggestions.push('No middleware found (middleware.ts, middleware.js, or under src/). Run init to create it.');
  }

  if (detected.routerType) {
    const handlerDir =
      detected.routerType === 'app'
        ? join(projectRoot, detected.appDir ?? 'app', 'api', 'accept-md')
        : join(projectRoot, detected.pagesDir ?? 'pages', 'api', 'accept-md');
    const handlerFiles =
      detected.routerType === 'app'
        ? ['route.ts', 'route.js']
        : ['index.ts', 'index.js'];
    if (!handlerFiles.some((f) => existsSync(join(handlerDir, f)))) {
      issues.push('Markdown handler not found. Run `npx accept-md init`.');
    }
  }

  const configPath = join(projectRoot, 'accept-md.config.js');
  if (!existsSync(configPath)) {
    suggestions.push('No accept-md.config.js. Run init to create a default config.');
  } else {
    const config = loadConfig(projectRoot);
    if (config.exclude?.some((e) => e === '/api/**') && detected.routerType === 'pages') {
      suggestions.push('API routes are excluded by default (correct).');
    }
  }

  if (routes.length === 0 && (detected.hasAppDir || detected.hasPagesDir)) {
    issues.push('No page routes detected. Check that you have page.tsx (app) or index/page files (pages).');
  }

  return {
    detected,
    routes,
    conflicts,
    issues,
    suggestions,
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const lines: string[] = [];
  lines.push('--- accept-md doctor ---');
  lines.push('');
  lines.push('Detection:');
  lines.push(`  Next.js: ${report.detected.isNext}`);
  lines.push(`  Router: ${report.detected.routerType ?? 'none'}`);
  lines.push(`  App dir: ${report.detected.hasAppDir} (${report.detected.appDir ?? 'n/a'})`);
  lines.push(`  Pages dir: ${report.detected.hasPagesDir} (${report.detected.pagesDir ?? 'n/a'})`);
  lines.push(`  Middleware: ${report.detected.middlewarePath ?? 'none'}`);
  lines.push(`  Config: ${report.detected.configPath ?? 'none'}`);
  lines.push('');
  lines.push(`Routes (${report.routes.length}):`);
  for (const r of report.routes.slice(0, 30)) {
    lines.push(`  ${r.path} ${r.isDynamic ? '(dynamic)' : ''}`);
  }
  if (report.routes.length > 30) {
    lines.push(`  ... and ${report.routes.length - 30} more`);
  }
  if (report.conflicts.length) {
    lines.push('');
    lines.push('Conflicts:');
    report.conflicts.forEach((c) => lines.push(`  - ${c}`));
  }
  if (report.issues.length) {
    lines.push('');
    lines.push('Issues:');
    report.issues.forEach((i) => lines.push(`  - ${i}`));
  }
  if (report.suggestions.length) {
    lines.push('');
    lines.push('Suggestions:');
    report.suggestions.forEach((s) => lines.push(`  - ${s}`));
  }
  lines.push('');
  return lines.join('\n');
}
