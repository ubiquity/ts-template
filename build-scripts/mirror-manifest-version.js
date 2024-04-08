#!/usr/bin/env node
const path = require("path");
const manifest = require("../package.json").manifest;
manifest.version = require("../package.json").version;
require("fs").writeFileSync(
  path.join(__dirname, "../src/manifest.json"),
  JSON.stringify(manifest, null, `\t`)
);

const commit = require("child_process")
  .execSync("git rev-parse --short=4 HEAD")
  .toString()
  .trim();

require("fs").writeFileSync(
  path.join(__dirname, "../src/commit.json"),
  JSON.stringify(
    {
      commit,
    },
    null,
    `\t`
  )
);
