#!/bin/bash
# Unpublish v3.0.0 from npm for all packages

echo "Unpublishing v3.0.0 from npm..."
echo ""

# Unpublish accept-md
echo "Unpublishing accept-md@3.0.0..."
npm unpublish accept-md@3.0.0 --force 2>&1 | head -3
echo ""

# Unpublish @accept-md/core
echo "Unpublishing @accept-md/core@3.0.0..."
npm unpublish @accept-md/core@3.0.0 --force 2>&1 | head -3
echo ""

# Unpublish accept-md-runtime
echo "Unpublishing accept-md-runtime@3.0.0..."
npm unpublish accept-md-runtime@3.0.0 --force 2>&1 | head -3
echo ""

echo "Verifying unpublish..."
for pkg in accept-md "@accept-md/core" "accept-md-runtime"; do
  result=$(npm view "$pkg@3.0.0" version 2>&1)
  if [[ "$result" == "3.0.0" ]]; then
    echo "⚠️  $pkg@3.0.0 still exists"
  else
    echo "✅ $pkg@3.0.0 removed"
  fi
done
