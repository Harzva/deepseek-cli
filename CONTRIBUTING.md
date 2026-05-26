# Contributing

Thanks for improving Provider API CLI Suite.

Please keep the public repo user-facing:

- Do not commit generated QA screenshots, local `.tmp-skills`, `node_modules`, or API keys.
- Keep CLI output script-friendly.
- Use `--json` for automation-friendly commands.
- Add tests when changing command behavior.

```bash
npm install --ignore-scripts
npm run validate
npm run docs:check
npm test
npm run pack:check
```
