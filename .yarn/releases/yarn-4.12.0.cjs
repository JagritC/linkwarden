#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

const result = spawnSync("corepack", ["yarn", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    YARN_IGNORE_PATH: "1",
  },
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
