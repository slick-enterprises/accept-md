# Release v3.0.0 - Instructions

## Status
✅ All package.json files updated to 3.0.0
✅ CLI fallback version updated to 3.0.0
✅ Build completed successfully
✅ All git tags v3.0.0+ deleted from local and GitHub

## Step 1: Commit changes (if not already committed)
```bash
git add .
git commit -m "chore: bump version to 3.0.0"
```

## Step 2: Login to npm
```bash
npm login
```

## Step 3: Unpublish v3.0.0 from npm (if it exists)

**Current status:** v3.0.0 exists in npm for all packages and needs to be removed.

Run the unpublish script (requires npm login):
```bash
npm login
./unpublish-3.0.0.sh
```

Or manually unpublish:

```bash
# Unpublish accept-md
npm unpublish accept-md@3.0.0 --force
npm unpublish accept-md@3.0.1 --force
npm unpublish accept-md@3.0.2 --force
npm unpublish accept-md@3.0.3 --force

# Unpublish @accept-md/core
npm unpublish @accept-md/core@3.0.0 --force
npm unpublish @accept-md/core@3.0.1 --force
npm unpublish @accept-md/core@3.0.2 --force
npm unpublish @accept-md/core@3.0.3 --force

# Unpublish accept-md-runtime
npm unpublish accept-md-runtime@3.0.0 --force
npm unpublish accept-md-runtime@3.0.1 --force
npm unpublish accept-md-runtime@3.0.2 --force
npm unpublish accept-md-runtime@3.0.3 --force
```

**Note:** If versions are older than 72 hours, you may need to contact npm support to unpublish them.

## Step 4: Verify unpublish
```bash
npm view accept-md versions --json | grep "3.0"
npm view @accept-md/core versions --json | grep "3.0"
npm view accept-md-runtime versions --json | grep "3.0"
```

Should return nothing if successfully unpublished.

## Step 5: Publish v3.0.0 via GitHub Actions

The GitHub Actions workflow (`.github/workflows/publish.yml`) is already configured to publish on tag push.

**Option 1: Push tag to trigger GitHub Actions (Recommended)**
```bash
# Commit and push your changes first
git add .
git commit -m "chore: bump version to 3.0.0"
git push origin main  # or your default branch

# Create and push the tag - this will trigger the GitHub Actions workflow
git tag v3.0.0
git push origin v3.0.0
```

The workflow will:
- Run lint and tests
- Build all packages
- Publish to npm in order: @accept-md/core → accept-md-runtime → accept-md

**Option 2: Create GitHub Release**
1. Go to GitHub → Releases → Create new release
2. Choose tag `v3.0.0` (create if needed)
3. Publish release

**Option 3: Manual publish (if GitHub Actions not working)**
```bash
npm login
pnpm run build
pnpm run publish:packages
```

## Step 6: Verify npm publication

After GitHub Actions completes, verify:
```bash
npm view accept-md version
npm view @accept-md/core version
npm view accept-md-runtime version
```

All should show `3.0.0`.

## Step 7: Monitor GitHub Actions

Check the workflow run:
- Go to GitHub → Actions tab
- Look for "Publish to npm" workflow
- Verify it completed successfully
