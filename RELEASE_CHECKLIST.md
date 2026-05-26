# Release Checklist

```bash
npm install --ignore-scripts
npm run validate
npm run docs:check
npm test
provider-api contract --json
provider-api skills install --all --dir .tmp-skills --json
```

Before publishing:

- Confirm no API keys or local secrets exist in the repository.
- Confirm README uses user-facing language.
- Confirm `node_modules`, `.tmp-skills`, and QA artifacts are excluded.
- Confirm package versions and core dependency ranges match.
