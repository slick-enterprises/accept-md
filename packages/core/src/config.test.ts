/**
 * Config tests: path matching and exclude logic.
 */

import { describe, it, expect } from 'vitest';
import { pathMatchesGlobs, shouldExcludePath } from './config.js';
import { DEFAULT_CONFIG } from './config.js';

describe('pathMatchesGlobs', () => {
  it('matches /**', () => {
    expect(pathMatchesGlobs('/', ['/**'])).toBe(true);
    expect(pathMatchesGlobs('/about', ['/**'])).toBe(true);
    expect(pathMatchesGlobs('/a/b/c', ['/**'])).toBe(true);
  });

  it('matches /api/**', () => {
    expect(pathMatchesGlobs('/api', ['/api/**'])).toBe(true);
    expect(pathMatchesGlobs('/api/foo', ['/api/**'])).toBe(true);
    expect(pathMatchesGlobs('/api/__markdown', ['/api/**'])).toBe(true);
    expect(pathMatchesGlobs('/other', ['/api/**'])).toBe(false);
  });

  it('matches exact path and normalizes trailing slash', () => {
    expect(pathMatchesGlobs('/about', ['/about'])).toBe(true);
    expect(pathMatchesGlobs('/about/', ['/about'])).toBe(true);
  });
});

describe('shouldExcludePath', () => {
  it('excludes when in exclude list', () => {
    const config = { ...DEFAULT_CONFIG, exclude: ['/api/**'] };
    expect(shouldExcludePath('/api/foo', config)).toBe(true);
    expect(shouldExcludePath('/about', config)).toBe(false);
  });

  it('excludes when not in include list', () => {
    const config = { ...DEFAULT_CONFIG, include: ['/about', '/'] };
    expect(shouldExcludePath('/about', config)).toBe(false);
    expect(shouldExcludePath('/other', config)).toBe(true);
  });
});
