# Release Checklist

```bash
npm install --ignore-scripts
npm run validate
npm run docs:check
npm test
npm run pack:check
npm run pack:npm
provider-api contract --json
provider-api skills install --all --dir .tmp-skills --json
```

Before publishing:

- Confirm no API keys or local secrets exist in the repository.
- Confirm README uses user-facing language.
- Confirm `node_modules`, `.tmp-skills`, and QA artifacts are excluded.
- Confirm package versions and core dependency ranges match.
- Confirm `dist/npm/npm-pack-manifest.json` lists all npm tarballs.
- Confirm GitHub Actions `ci` and `npm-package` workflows pass.
- Confirm npm scope/package ownership before running any registry publish.
