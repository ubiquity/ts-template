#!/usr/bin/env node

require("dotenv").config();
const dist = process.env.DISTRIBUTE_DIR;
if (!dist) process.exit(0);

const path = require("path");
const fse = require("fs-extra");
const VERSION = require("../package.json").version;

let buildPath;

if (dist) {
  buildPath = `${require("os").homedir()}/${dist}/builds/${VERSION}`;
}

function copyDist(source, target) {
  const sourcePath = path.join(__dirname, `../dist/${source}`);
  if (fse.pathExistsSync(sourcePath)) {
    const targetPath = `${buildPath}/${target}`;
    fse.copy(sourcePath, targetPath);
    console.log(`Copied ${sourcePath} => ${targetPath}`);
  }
}

copyDist("webext-dev", "Development");
copyDist("webext-prod", "Production");
