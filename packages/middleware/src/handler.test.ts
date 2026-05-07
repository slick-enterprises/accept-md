import { describe, expect, it } from 'vitest';
import { pathMatches } from './handler.js';

describe('pathMatches', () => {
  describe('literal segments', () => {
    it('matches exact paths', () => {
      expect(pathMatches('/admin', ['/admin'])).toBe(true);
      expect(pathMatches('/admin/users', ['/admin/users'])).toBe(true);
    });

    it('does not match different paths', () => {
      expect(pathMatches('/blog', ['/admin'])).toBe(false);
      expect(pathMatches('/admin/users', ['/admin/posts'])).toBe(false);
    });

    it('treats trailing slash as equivalent', () => {
      expect(pathMatches('/admin/', ['/admin'])).toBe(true);
    });
  });

  describe('single * wildcard', () => {
    it('matches exactly one segment', () => {
      expect(pathMatches('/foo/x/bar', ['/foo/*/bar'])).toBe(true);
    });

    it('does not match multiple segments', () => {
      expect(pathMatches('/foo/x/y/bar', ['/foo/*/bar'])).toBe(false);
    });

    it('does not match zero segments', () => {
      expect(pathMatches('/foo/bar', ['/foo/*/bar'])).toBe(false);
    });
  });

  describe('double ** wildcard', () => {
    it('matches everything when used alone', () => {
      expect(pathMatches('/anything', ['**'])).toBe(true);
      expect(pathMatches('/foo/bar/baz', ['**'])).toBe(true);
      expect(pathMatches('/', ['**'])).toBe(true);
    });

    it('matches recursively as a path prefix', () => {
      expect(pathMatches('/admin', ['/admin/**'])).toBe(true);
      expect(pathMatches('/admin/users', ['/admin/**'])).toBe(true);
      expect(pathMatches('/admin/users/1', ['/admin/**'])).toBe(true);
    });

    it('does not match unrelated paths when used as a prefix', () => {
      expect(pathMatches('/blog', ['/admin/**'])).toBe(false);
      expect(pathMatches('/blog/post-1', ['/admin/**'])).toBe(false);
    });

    it('matches recursively as a path suffix (regression: **/admin used to match everything)', () => {
      expect(pathMatches('/admin', ['**/admin'])).toBe(true);
      expect(pathMatches('/foo/admin', ['**/admin'])).toBe(true);
      expect(pathMatches('/foo/bar/admin', ['**/admin'])).toBe(true);
    });

    it('does NOT match arbitrary paths just because pattern starts with **', () => {
      expect(pathMatches('/blog', ['**/admin'])).toBe(false);
      expect(pathMatches('/admin/foo', ['**/admin'])).toBe(false);
    });

    it('matches in the middle of a pattern', () => {
      expect(pathMatches('/foo/x/y/bar', ['/foo/**/bar'])).toBe(true);
      expect(pathMatches('/foo/bar', ['/foo/**/bar'])).toBe(true);
      expect(pathMatches('/blog/2024/post', ['/blog/**/post'])).toBe(true);
      expect(pathMatches('/foo/bar/baz', ['/foo/**/bar'])).toBe(false);
    });
  });

  describe('multiple patterns', () => {
    it('returns true if any pattern matches', () => {
      expect(pathMatches('/api/users', ['/admin/**', '/api/**'])).toBe(true);
    });

    it('returns false if no pattern matches', () => {
      expect(pathMatches('/blog', ['/admin/**', '/api/**'])).toBe(false);
    });

    it('returns false on empty pattern list', () => {
      expect(pathMatches('/anything', [])).toBe(false);
    });
  });
});
