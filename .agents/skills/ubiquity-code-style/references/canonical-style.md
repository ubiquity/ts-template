# Canonical TypeScript style - ubiquity/ts-template

Canonical source: [`ubiquity/ts-template`](https://github.com/ubiquity/ts-template) at
[`59dc49340e5f091ab8ec06d009afaab3ffdcb8d6`](https://github.com/ubiquity/ts-template/tree/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6).
Exact permalinks for every cited file are in
[sources-and-exceptions.md](sources-and-exceptions.md).

This reference is self-contained: it contains the exact settings needed to
recreate the canonical ruleset without access to the original repository. The
canonical ESLint preset is **recommended** (`@eslint/js` recommended,
`typescript-eslint` recommended, `eslint-plugin-sonarjs` recommended), not
`recommendedTypeChecked` or `strictTypeChecked`. `strictTypeChecked` and
`stylisticTypeChecked` are additions made by the Deno implementations, not part of
the canonical template; see [deno.md](deno.md). The type-aware rules the canonical
config does use are explicit entries in its `rules` block.

## 1. Prettier

Copy [../assets/prettier.json](../assets/prettier.json) to the target's Prettier
configuration when the target has none, or when the user explicitly asks for the
canonical style. The exact canonical values are:

| Option                      | Value                   |
| --------------------------- | ----------------------- |
| `printWidth`                | `160`                   |
| `tabWidth`                  | `2`                     |
| `useTabs`                   | `false`                 |
| `semi`                      | `true`                  |
| `singleQuote`               | `false` (double quotes) |
| `trailingComma`             | `"es5"`                 |
| `htmlWhitespaceSensitivity` | `"strict"`              |
| `plugins`                   | `[]` (empty)            |

The canonical repository has no `.prettierignore` and its `format:prettier`
script is `prettier --write .`. Prettier's own defaults and any ignore files
already present in the target still apply. When another formatter shares the
repository, create an explicit ignore file for the types the other formatter
owns, and verify with real glob matches. When the target contains `.tsx`/`.jsx`,
assign them to exactly one formatter and exclude them from the other.

`printWidth: 160` is the canonical **TypeScript** preference. It is not a mandate
to change another formatter's width: the gateway keeps `deno fmt` at its existing
`lineWidth: 120` for the file types Deno owns.

## 2. ESLint composition (exact)

The canonical config is a single flat-config export. This is the complete
canonical file:

```js
// @ts-check
import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import checkFile from "eslint-plugin-check-file";
import noEmptyStrings from "@ubiquity-os/eslint-plugin-no-empty-strings";

export default tsEslint.config({
  plugins: {
    "@typescript-eslint": tsEslint.plugin,
    "check-file": checkFile,
    "@ubiquity-os": noEmptyStrings,
  },
  ignores: ["**/*.js", ".github/**.ts"],
  extends: [eslint.configs.recommended, ...tsEslint.configs.recommended, sonarjs.configs.recommended],
  languageOptions: {
    parser: tsEslint.parser,
    parserOptions: {
      project: ["./tsconfig.json"],
      allowDefaultProject: ["*.mjs"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    "@ubiquity-os/no-empty-strings": "warn",
    "check-file/filename-naming-convention": [
      "error",
      {
        "**/*.{js,ts}": "+([-._a-z0-9])",
      },
    ],
    "prefer-arrow-callback": ["warn", { allowNamedFunctions: true }],
    "func-style": ["warn", "declaration", { allowArrowFunctions: false }],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "constructor-super": "error",
    "no-invalid-this": "off",
    "@typescript-eslint/no-invalid-this": "error",
    "no-restricted-syntax": ["error", "ForInStatement"],
    "use-isnan": "error",
    "no-unneeded-ternary": "error",
    "no-nested-ternary": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "after-used",
        ignoreRestSiblings: true,
        vars: "all",
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/await-thenable": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/restrict-plus-operands": "error",
    "sonarjs/no-all-duplicated-branches": "error",
    "sonarjs/no-collection-size-mischeck": "error",
    "sonarjs/no-duplicated-branches": "error",
    "sonarjs/no-element-overwrite": "error",
    "sonarjs/no-identical-conditions": "error",
    "sonarjs/no-identical-expressions": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["StrictPascalCase"],
        custom: { regex: "^I[A-Z]", match: false },
      },
      {
        selector: "memberLike",
        modifiers: ["private"],
        format: ["strictCamelCase"],
        leadingUnderscore: "require",
      },
      {
        selector: "typeLike",
        format: ["StrictPascalCase"],
      },
      {
        selector: "typeParameter",
        format: ["StrictPascalCase"],
        prefix: ["T"],
      },
      {
        selector: "variable",
        format: ["strictCamelCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
        trailingUnderscore: "allow",
      },
      {
        selector: "variable",
        modifiers: ["destructured"],
        format: null,
      },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["StrictPascalCase"],
        prefix: ["is", "should", "has", "can", "did", "will", "does"],
      },
      {
        selector: "variableLike",
        format: ["strictCamelCase"],
      },
      {
        selector: ["function", "variable"],
        format: ["strictCamelCase"],
      },
    ],
  },
});
```

Mechanics that matter:

- `ignores: ["**/*.js", ".github/**.ts"]` means plain JavaScript files are not
  linted, and `.github/**.ts` excludes only files directly under `.github/`. It is
  a literal, non-recursive pattern, not the recursive `.github/**/*.ts`; check the
  target's real nested matches before relying on it, and do not broaden the ignore
  list in a target.
- The snapshot places `allowDefaultProject: ["*.mjs"]` beside
  `project: ["./tsconfig.json"]`, but the parser defines `allowDefaultProject`
  inside `parserOptions.projectService`
  ([parser docs](https://typescript-eslint.io/packages/parser/)), not as a
  fallback for a `project` program. As copied, the snapshot does not make
  `eslint.config.mjs` lint successfully. Preserve it unchanged as historical
  source; for the target's installed typescript-eslint version, either add the
  file to a program referenced by `parserOptions.project` or use a supported
  `projectService` configuration where that version offers one, then verify typed
  coverage of the intended files. Do not force a `projectService` migration or a
  new install for a narrow task. In a Deno target, read [deno.md](deno.md) before
  reusing either path.
- `tsconfigRootDir: import.meta.dirname` matters as soon as the config file is not
  at the project root.
- `check-file/filename-naming-convention` applies `+([-._a-z0-9])` to `**/*.{js,ts}`
  only; the target's real file set decides whether more extensions need coverage.
- TSX/JSX when present: the snapshot has no `files` key and its naming glob covers
  `.js`/`.ts` only. Add the target's real `**/*.tsx` (and `**/*.jsx`) files to the
  ESLint files/ignore globs, to `check-file/filename-naming-convention`, to the
  type-aware lint program's `include` with a JSX compiler option such as
  `"jsx": "react-jsx"` and `"allowJs": true` for `.jsx` inputs, to formatter ownership
  and its ignore files, and to Knip `project`/entry scopes. Do not ignore owned source
  to make checks pass.

Coverage by category, so nothing is missed when recreating the ruleset:

- Recommended presets: `@eslint/js` recommended, `typescript-eslint` recommended,
  and `eslint-plugin-sonarjs` recommended. The `typescript-eslint` preset here is
  not `recommendedTypeChecked` or `strictTypeChecked`; the type-aware rules the
  config uses (`no-floating-promises`, `await-thenable`,
  `restrict-plus-operands`) are explicit entries in its `rules` block, as are the
  other `@typescript-eslint/*` entries listed there. The Deno references add
  `strictTypeChecked` and `stylisticTypeChecked`; see [deno.md](deno.md).
- Promises and async: `@typescript-eslint/no-floating-promises`,
  `@typescript-eslint/await-thenable`.
- Assertions and `this`: `@typescript-eslint/no-non-null-assertion`; core
  `no-invalid-this` off, typed `@typescript-eslint/no-invalid-this` on.
- Control flow and expressions: `constructor-super`, `use-isnan`,
  `no-unneeded-ternary`, `no-nested-ternary`, `no-restricted-syntax` with
  `ForInStatement`, `@typescript-eslint/restrict-plus-operands`.
- Unused code: `@typescript-eslint/no-unused-vars` for locals, parameters, and
  rest siblings, with the `^_` ignore patterns.
- Naming: `check-file/filename-naming-convention` for file names plus
  `@typescript-eslint/naming-convention` for types, interfaces, generics, private
  members, variables, and boolean variables, exactly as section 3 lists.
- SonarJS duplicate and correctness rules: the six explicit `sonarjs/no-*` rules
  in the config above.

## 3. Naming selectors and options

The full selector list in source order, exactly as copied from the canonical
config:

| Source order | Selector                    | Options                                                                                                   |
| ------------ | --------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1            | `interface`                 | `format: ["StrictPascalCase"]`, `custom: { regex: "^I[A-Z]", match: false }` (no `I`-prefixed interfaces) |
| 2            | `memberLike` + `private`    | `format: ["strictCamelCase"]`, `leadingUnderscore: "require"`                                             |
| 3            | `typeLike`                  | `format: ["StrictPascalCase"]`                                                                            |
| 4            | `typeParameter`             | `format: ["StrictPascalCase"]`, `prefix: ["T"]`                                                           |
| 5            | `variable`                  | `format: ["strictCamelCase", "UPPER_CASE"]`, `leadingUnderscore: "allow"`, `trailingUnderscore: "allow"`  |
| 6            | `variable` + `destructured` | `format: null` (no constraint)                                                                            |
| 7            | `variable` + boolean type   | `format: ["StrictPascalCase"]`, `prefix: ["is", "should", "has", "can", "did", "will", "does"]`           |
| 8            | `variableLike`              | `format: ["strictCamelCase"]`                                                                             |
| 9            | `function` and `variable`   | `format: ["strictCamelCase"]`                                                                             |

Array order does not decide matching: `@typescript-eslint/naming-convention`
sorts selectors from most specific to least specific and applies the most
specific match
([naming-convention docs](https://typescript-eslint.io/rules/naming-convention/)).
Read the table as source order, not evaluation order; keep the source order when
copying for fidelity to the config. The boolean prefix rule matches prefixes
without a word boundary and therefore misreads words such as `cancelled` as `can`

- `celled`; the Deno references record two measured responses (a wider
  `booleanNamePattern`, or disabling only the boolean selector). Prefer a measured
  target decision over guessing.

### Known incompatibility: `^_` unused names

`@typescript-eslint/no-unused-vars` accepts `varsIgnorePattern: "^_"` and
`argsIgnorePattern: "^_"`, but canonical selector 8 (`variableLike`, which covers
parameters) has no filter, so deliberately unused names such as `_ctx` or `_signal`
are reported as not `strictCamelCase`. This is a known incompatibility between two
canonical rules. It is not a reason to force meaningless renames.

The measured adaptation used by the gateway, once the conflict is actually hit, is
to keep selector 8 and add:

```js
{
  selector: "variableLike",
  format: ["strictCamelCase"],
  filter: { regex: "^_", match: false },
}
```

Record the finding count when applying it. Do not add the filter pre-emptively if
the target has no such names.

## 4. Severity distinctions

- `warn`: `@ubiquity-os/no-empty-strings`, `prefer-arrow-callback`, `func-style`.
- `error`: every explicitly configured rule above, plus whatever severity each
  recommended preset already assigns.
- `off`: core `no-invalid-this`, replaced by `@typescript-eslint/no-invalid-this`.

Do not silently promote warnings to errors, or demote errors to warnings. A
severity change is a target-repository decision and belongs in the handback.

## 5. Tool roles

Each tool owns one job; do not use one to compensate for another.

| Tool                | Owns                                               | Check command                       | Mutating command            |
| ------------------- | -------------------------------------------------- | ----------------------------------- | --------------------------- |
| Prettier            | Formatting (`*.ts` plus whatever else it is given) | `prettier --check .`                | `prettier --write .`        |
| ESLint              | Type-aware lint rules                              | `eslint .`                          | `eslint --fix .`            |
| CSpell              | Spelling                                           | `cspell **/*`                       | none (report only)          |
| Knip                | Unused files, exports, types, dependencies         | `knip --config .github/knip.ts`     | `knip --fix` (review first) |
| Husky + lint-staged | Staged-file gates at commit time                   | runs on commit                      | hooks mutate staged files   |
| commitlint          | Commit message format                              | `commitlint --edit "$1"` (via hook) | none                        |

Canonical CSpell settings:

```json
{
  "$schema": "https://raw.githubusercontent.com/streetsidesoftware/cspell/main/cspell.schema.json",
  "version": "0.2",
  "ignorePaths": ["**/*.json", "**/*.css", "node_modules", "**/*.log"],
  "useGitignore": true,
  "language": "en",
  "words": ["dataurl", "devpool", "outdir", "servedir"],
  "dictionaries": ["typescript", "node", "software-terms"],
  "import": ["@cspell/dict-typescript/cspell-ext.json", "@cspell/dict-node/cspell-ext.json", "@cspell/dict-software-terms"],
  "ignoreRegExpList": ["[0-9a-fA-F]{6}"]
}
```

Canonical Knip settings (`.github/knip.ts`):

```ts
import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["build/index.ts", ".github/empty-string-checker.ts"],
  project: ["src/**/*.ts"],
  ignore: ["src/types/config.ts", "**/__mocks__/**", "**/__fixtures__/**", "eslint.config.mjs"],
  ignoreExportsUsedInFile: true,
  // eslint can also be safely ignored as per the docs: https://knip.dev/guides/handling-issues#eslint--jest
  ignoreDependencies: ["eslint-config-prettier", "eslint-plugin-prettier", "@types/jest", "@mswjs/data", "husky"],
  eslint: true,
};

export default config;
```

Knip rules that generalize:

- Set `entry` from the target's real executable and test entry points, and
  `project` to the directories that are actually source. By default Knip does not
  report entry exports as unused
  ([`includeEntryExports`](https://knip.dev/reference/configuration#includeentryexports)).
  Set `includeEntryExports: true` only for a self-contained private app whose
  entry-point exports should be checked. For a published package whose exports are
  used outside the repository, protect the public surface through appropriate
  `entry`/public-API configuration and normally leave `includeEntryExports` false
  or omitted; never delete public library exports merely because no internal
  import uses them.
- Every `ignoreDependencies` entry needs a real usage reason. Two of the
  canonical ignores (`eslint-config-prettier`, `eslint-plugin-prettier`) name
  packages the canonical template does not even declare, so treat inherited
  ignore lists as stale until verified.
- `ignoreExportsUsedInFile: true` and bounded, evidence-backed dynamic-import
  exemptions are fine; blindly deleting exports Knip cannot trace is not.
- Do not copy repository-specific filenames or allowlists as universal defaults.

Husky, lint-staged, and commitlint are part of the canonical inventory, not
mandatory additions to every request. Canonical wiring: `.husky/pre-commit` runs
`bun lint-staged`; `.husky/commit-msg` runs `bun commitlint --edit "$1"`;
`lint-staged` maps `*.ts` to `prettier --write` then `eslint --fix`, and
`src/**.{ts,json}` to `cspell`; `commitlint` extends
`@commitlint/config-conventional`; `prepare` runs `husky`.

## 6. Node/Bun setup

- `engines`: `node >=20.10.0`, `bun >=1.0.0`.
- Canonical scripts:
  - `format`: `run-s format:lint format:prettier format:cspell` (mutating)
  - `format:lint`: `eslint --fix .`
  - `format:prettier`: `prettier --write .`
  - `format:cspell`: `cspell **/*`
  - `knip`: `knip --config .github/knip.ts`
  - `knip-ci`: `knip --no-exit-code --reporter json --config .github/knip.ts`
  - `prepare`: `husky`
- There is no canonical non-mutating ESLint or Prettier script. Run the local
  binaries directly for checks.
- Invoke `node_modules/.bin/<tool>` (directly or through a script). `npx` can
  install ESLint but cannot make the config's bare plugin imports resolve.
- Version selection: pick a mutually compatible set from the target's manifest and
  lockfile. Copying the whole package manifest is unsafe: it mixes runtime
  dependencies (for example `dotenv`) with dev tooling and would change the
  target's runtime. Take only the `devDependencies`, scripts, and config entries
  the target actually needs. Canonical pinned example (dated evidence, not latest):
  `eslint 9.14.0`,
  `typescript-eslint ^8.39.0`, `eslint-plugin-sonarjs ^2.0.4`,
  `eslint-plugin-check-file ^2.8.0`, `knip ^5.62.0`, `prettier ^3.6.2`,
  `typescript ^5.9.2`, `@types/node ^20.19.9`, `cspell ^8.19.4`,
  `husky ^9.1.7`, `lint-staged ^15.5.2`, `@commitlint/cli ^18.6.1`,
  `@eslint/js ^9.32.0`, `@ubiquity-os/eslint-plugin-no-empty-strings ^1.0.3`.
  The Deno references use newer major lines; do not mix them blindly.

## 7. CI reality

The canonical template's workflows run build, Jest, Cypress, CSpell, Knip,
conventional-commits, and release/deploy jobs. There is **no** CI job that runs
`eslint` or `prettier --check`, so a green template CI does not prove lint or
format cleanliness. Do not describe local tooling as CI-enforced, and do not
modify CI or hook behavior as part of a style migration unless the user asks.
