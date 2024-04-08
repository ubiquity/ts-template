#!/usr/bin/env node

const zaf = require("zip-a-folder");
const fs = require("fs");
const path = require("path");
const distDirectory = path.join(__dirname, "..", "dist");
const VERSION = require("../package.json").version;

if (!fs.existsSync(distDirectory)) {
  fs.mkdirSync(distDirectory);
}

const commit = require("child_process")
  .execSync("git rev-parse --short=4 HEAD")
  .toString()
  .trim();

zaf.zip(
  path.join(distDirectory, "webext-prod"),
  path.resolve(`${distDirectory}`, `lrdscx-${commit}-${VERSION}.zip`)
);
