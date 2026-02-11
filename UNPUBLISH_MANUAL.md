# Manual Unpublish Instructions

## Status
✅ `accept-md@3.0.0` (CLI) - Successfully unpublished
⚠️  `accept-md-runtime@3.0.0` - Needs manual unpublish with 2FA
⚠️  `@accept-md/core@3.0.0` - Needs manual unpublish with 2FA

## Complete the Unpublish

Since the CLI package is now unpublished, the other two should be unpublishable. Run these commands with your 2FA code:

```bash
# Get your 2FA code from your authenticator app, then:

npm unpublish accept-md-runtime@3.0.0 --force --otp=<YOUR_2FA_CODE>
npm unpublish @accept-md/core@3.0.0 --force --otp=<YOUR_2FA_CODE>
```

Replace `<YOUR_2FA_CODE>` with the 6-digit code from your authenticator app.

## Verify Unpublish

After unpublishing, verify all are removed:
```bash
npm view accept-md@3.0.0 version        # Should error (404)
npm view accept-md-runtime@3.0.0 version # Should error (404)
npm view @accept-md/core@3.0.0 version  # Should error (404)
```

## Then Publish via GitHub Actions

Once all versions are unpublished, push the tag to trigger the workflow:
```bash
git tag v3.0.0
git push origin v3.0.0
```

The GitHub Actions workflow will then publish v3.0.0 successfully.
