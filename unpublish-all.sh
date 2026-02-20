#!/bin/bash
# Script to unpublish all versions from npm registry
# Note: npm only allows unpublishing packages published within 72 hours
# Older packages will need to be deprecated instead

echo "⚠️  WARNING: npm only allows unpublishing packages published within 72 hours"
echo "Older packages will fail and should be deprecated instead"
echo ""

# Get all versions for each package
ACCEPT_MD_VERSIONS=$(npm view accept-md versions --json | tr -d '[],"' | tr ',' '\n' | grep -v '^$')
ACCEPT_MD_RUNTIME_VERSIONS=$(npm view accept-md-runtime versions --json | tr -d '[],"' | tr ',' '\n' | grep -v '^$')
ACCEPT_MD_CORE_VERSIONS=$(npm view @accept-md/core versions --json | tr -d '[],"' | tr ',' '\n' | grep -v '^$')

echo "Attempting to unpublish accept-md versions..."
for version in $ACCEPT_MD_VERSIONS; do
  echo "Unpublishing accept-md@$version..."
  npm unpublish accept-md@$version --force 2>&1 || echo "  Failed (likely >72 hours old, will need to deprecate)"
done

echo ""
echo "Attempting to unpublish accept-md-runtime versions..."
for version in $ACCEPT_MD_RUNTIME_VERSIONS; do
  echo "Unpublishing accept-md-runtime@$version..."
  npm unpublish accept-md-runtime@$version --force 2>&1 || echo "  Failed (likely >72 hours old, will need to deprecate)"
done

echo ""
echo "Attempting to unpublish @accept-md/core versions..."
for version in $ACCEPT_MD_CORE_VERSIONS; do
  echo "Unpublishing @accept-md/core@$version..."
  npm unpublish @accept-md/core@$version --force 2>&1 || echo "  Failed (likely >72 hours old, will need to deprecate)"
done

echo ""
echo "✅ Done! Packages that couldn't be unpublished (>72 hours old) should be deprecated instead."
echo "To deprecate old versions, use: npm deprecate <package>@<version> 'Deprecated in favor of 1.0.0'"
