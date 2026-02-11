# Quick Guide: Publish v3.0.0 via GitHub Actions

## Current Status
✅ All packages updated to 3.0.0
✅ Git tags v3.0.0+ removed from GitHub
✅ GitHub Actions workflow configured (`.github/workflows/publish.yml`)
⚠️  v3.0.0 exists in npm and needs to be removed first

## Steps to Publish

### 1. Unpublish v3.0.0 from npm (requires npm login)

```bash
# Login to npm
npm login

# Unpublish v3.0.0 from all packages
npm unpublish accept-md@3.0.0 --force
npm unpublish @accept-md/core@3.0.0 --force
npm unpublish accept-md-runtime@3.0.0 --force

# Verify removal
npm view accept-md@3.0.0 version  # Should error
npm view @accept-md/core@3.0.0 version  # Should error
npm view accept-md-runtime@3.0.0 version  # Should error
```

### 2. Commit and push changes

```bash
git add .
git commit -m "chore: bump version to 3.0.0"
git push origin main  # or your default branch name
```

### 3. Create and push tag (triggers GitHub Actions)

```bash
git tag v3.0.0
git push origin v3.0.0
```

### 4. Monitor GitHub Actions

- Go to: https://github.com/slick-enterprises/accept-md/actions
- Watch the "Publish to npm" workflow
- It will:
  1. Run lint and tests
  2. Build all packages
  3. Publish to npm in order: @accept-md/core → accept-md-runtime → accept-md

### 5. Verify publication

After workflow completes:
```bash
npm view accept-md version        # Should show 3.0.0
npm view @accept-md/core version  # Should show 3.0.0
npm view accept-md-runtime version # Should show 3.0.0
```

## Notes

- The GitHub Actions workflow uses npm Trusted Publisher (OIDC), so no NPM_TOKEN is needed
- Make sure Trusted Publisher is configured on npm for each package:
  - Package → Settings → Trusted Publisher → GitHub Actions
  - Organization: slick-enterprises
  - Repository: accept-md
  - Workflow: publish.yml
