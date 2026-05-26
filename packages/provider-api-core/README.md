# Provider API Core

Shared runtime package for DeepSeek CLI and the provider-specific API CLI packages.

It exports provider metadata, request builders, dry-run envelopes, output contracts, Skill installation helpers, and the `runProviderCli` / `runSuiteCli` entrypoints used by package `bin` files.

This package is intended as an internal workspace dependency for the CLI packages, but it is publishable so each npm package can resolve the same runtime through normal npm dependency rules.
