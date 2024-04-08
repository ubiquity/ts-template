#!/usr/bin/env node

const environmentVariables = require("dotenv").config().parsed || {};
const requiredEnvironmentVariables = [
  "STRIPE_PUBLISH_KEY_DEV",
  "STRIPE_PUBLISH_KEY",
  "STRIPE_PRICE_ID",
  "SEGMENT_KEY",
];
const requiredEnvironmentVariablesNotFound =
  requiredEnvironmentVariables.filter(
    (variable) => !environmentVariables[variable] && !process?.env?.[variable]
  );
if (requiredEnvironmentVariablesNotFound.length > 0) {
  throw new Error(
    `Required environment variables not found in .env:${requiredEnvironmentVariablesNotFound
      .map((variable) => `"${variable}"`)
      .join(", ")}`
  );
}
