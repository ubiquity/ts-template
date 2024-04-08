#!/usr/bin/env node

const path = require("path");
const manifest = require("../src/manifest.json");

const suffix = process.env.NODE_ENV === "production" ? "-prod.png" : "-dev.png";

manifest.browser_action.default_icon = `assets/icons/icon${128}${suffix}`;
manifest.icons["16"] = `assets/icons/icon${16}${suffix}`;
manifest.icons["32"] = `assets/icons/icon${32}${suffix}`;
manifest.icons["48"] = `assets/icons/icon${48}${suffix}`;
manifest.icons["128"] = `assets/icons/icon${128}${suffix}`;

require("fs").writeFileSync(
  path.join(__dirname, "../src/manifest.json"),
  JSON.stringify(manifest, null, `\t`)
);
