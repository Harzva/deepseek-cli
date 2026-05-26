#!/usr/bin/env node
import { runProviderCli } from '@just-agent/provider-api-core';
await runProviderCli('bedrock', process.argv.slice(2));
