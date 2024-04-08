# Orion Black | LinkedIn Scraper Chrome Extension

[![CI](https://github.com/orion-black-tech/cx-linkedin-scraper/actions/workflows/CI.yml/badge.svg)](https://github.com/orion-black-tech/cx-linkedin-scraper/actions/workflows/CI.yml)


1. Install dependencies
2. Init `.env`
3. Edit `.env`

```shell
yarn & cp ./.env.example ./.env && code ./.env
```

## Development

The extension uses Parcel for bundling, with the [@parcel/config-webextension](https://v2.parceljs.org/recipes/web-extension/) pre-configuration. After initially loading the extension on Chrome, everything reloads automatically.

```shell
yarn watch
```

You should be able to find the folder `dist/webext-dev` which can be loaded unzipped to Chrome at [chrome://extensions/](chrome://extensions/) when the development mode is activated.

## Hot Module Replacement

HMR works out of the box on every page. The only caveat is that the CSS injected with the content-scripts does not HMR. [This is a known limitation](https://github.com/parcel-bundler/parcel/issues/5865), and could in theory be overcome. However, the workaround to work on the UI created by the content-script with HMR is to go to the extension options page, where you will see a mirror of the content-script UI that reloads instantly with CSS changes.