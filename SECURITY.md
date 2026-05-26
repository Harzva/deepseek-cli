# Security

Never commit API keys, provider tokens, `.env` files, or logs containing secrets.

The CLI redacts secrets in config, doctor, dry-run, and curl output. If you find a leak, rotate the affected key and report it privately.

The CLI does not execute tool calls, shell commands, or code patches. Keep those actions inside an approval-gated Harness.
