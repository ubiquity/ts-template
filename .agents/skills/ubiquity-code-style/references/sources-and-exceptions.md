# Sources, measured exceptions, and drift

This file records where the skill's authority comes from, which project exceptions
were measured, and where source documents disagree with themselves or with the
code. Read it before citing authority, exceptions, or versions.

## 1. Exact sources

### Canonical: ubiquity/ts-template

Repository: <https://github.com/ubiquity/ts-template>
Commit: [`59dc49340e5f091ab8ec06d009afaab3ffdcb8d6`](https://github.com/ubiquity/ts-template/tree/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6)

| File                                     | Permalink                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `.prettierrc`                            | [blob/59dc4934/.prettierrc](https://github.com/ubiquity/ts-template/blob/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/.prettierrc)             |
| `eslint.config.mjs`                      | [blob/59dc4934/eslint.config.mjs](https://github.com/ubiquity/ts-template/blob/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/eslint.config.mjs) |
| `package.json`                           | [blob/59dc4934/package.json](https://github.com/ubiquity/ts-template/blob/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/package.json)           |
| `.cspell.json`                           | [blob/59dc4934/.cspell.json](https://github.com/ubiquity/ts-template/blob/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/.cspell.json)           |
| `.github/knip.ts`                        | [blob/59dc4934/.github/knip.ts](https://github.com/ubiquity/ts-template/blob/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/.github/knip.ts)     |
| `.husky/pre-commit`, `.husky/commit-msg` | [tree/59dc4934/.husky](https://github.com/ubiquity/ts-template/tree/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/.husky)                       |
| `.github/workflows/`                     | [tree/59dc4934/.github/workflows](https://github.com/ubiquity/ts-template/tree/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/.github/workflows) |
| `tsconfig.json`                          | [blob/59dc4934/tsconfig.json](https://github.com/ubiquity/ts-template/blob/59dc49340e5f091ab8ec06d009afaab3ffdcb8d6/tsconfig.json)         |

### Complex Deno reference (gateway profile): ubiquity/ai.ubq.fi

Repository: <https://github.com/ubiquity/ai.ubq.fi>
Commit: [`e6501a44646c29d099ad901fb343e95960536576`](https://github.com/ubiquity/ai.ubq.fi/tree/e6501a44646c29d099ad901fb343e95960536576)

| File                           | Permalink                                                                                                                                                      |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tools/lint/README.md`         | [blob/e6501a44/tools/lint/README.md](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/tools/lint/README.md)                 |
| `tools/lint/eslint.config.mjs` | [blob/e6501a44/tools/lint/eslint.config.mjs](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/tools/lint/eslint.config.mjs) |
| `tools/lint/package.json`      | [blob/e6501a44/tools/lint/package.json](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/tools/lint/package.json)           |
| `tsconfig.lint.json`           | [blob/e6501a44/tsconfig.lint.json](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/tsconfig.lint.json)                     |
| `knip.json`                    | [blob/e6501a44/knip.json](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/knip.json)                                       |
| `.prettierignore`              | [blob/e6501a44/.prettierignore](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/.prettierignore)                           |
| `deno.json`                    | [blob/e6501a44/deno.json](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/deno.json)                                       |
| `scripts/_bootstrap.sh`        | [blob/e6501a44/scripts/\_bootstrap.sh](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/scripts/_bootstrap.sh)              |
| `scripts/verify.sh`            | [blob/e6501a44/scripts/verify.sh](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/scripts/verify.sh)                       |
| `scripts/lint.sh`              | [blob/e6501a44/scripts/lint.sh](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/scripts/lint.sh)                           |
| `scripts/format.sh`            | [blob/e6501a44/scripts/format.sh](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/scripts/format.sh)                       |
| `scripts/knip.sh`              | [blob/e6501a44/scripts/knip.sh](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/scripts/knip.sh)                           |
| `AGENTS.md`                    | [blob/e6501a44/AGENTS.md](https://github.com/ubiquity/ai.ubq.fi/blob/e6501a44646c29d099ad901fb343e95960536576/AGENTS.md)                                       |

### Simple Deno reference (simple profile): 0x4007/gpt-pro-skill

Repository: <https://github.com/0x4007/gpt-pro-skill>
Commit: [`93d6a8cf16141216231e9020e666c3093ede3152`](https://github.com/0x4007/gpt-pro-skill/tree/93d6a8cf16141216231e9020e666c3093ede3152)

| File                 | Permalink                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint.config.mjs`  | [blob/93d6a8cf/eslint.config.mjs](https://github.com/0x4007/gpt-pro-skill/blob/93d6a8cf16141216231e9020e666c3093ede3152/eslint.config.mjs)   |
| `tsconfig.lint.json` | [blob/93d6a8cf/tsconfig.lint.json](https://github.com/0x4007/gpt-pro-skill/blob/93d6a8cf16141216231e9020e666c3093ede3152/tsconfig.lint.json) |
| `knip.json`          | [blob/93d6a8cf/knip.json](https://github.com/0x4007/gpt-pro-skill/blob/93d6a8cf16141216231e9020e666c3093ede3152/knip.json)                   |
| `.prettierrc`        | [blob/93d6a8cf/.prettierrc](https://github.com/0x4007/gpt-pro-skill/blob/93d6a8cf16141216231e9020e666c3093ede3152/.prettierrc)               |
| `package.json`       | [blob/93d6a8cf/package.json](https://github.com/0x4007/gpt-pro-skill/blob/93d6a8cf16141216231e9020e666c3093ede3152/package.json)             |
| `deno.json`          | [blob/93d6a8cf/deno.json](https://github.com/0x4007/gpt-pro-skill/blob/93d6a8cf16141216231e9020e666c3093ede3152/deno.json)                   |
| `scripts/`           | [tree/93d6a8cf/scripts](https://github.com/0x4007/gpt-pro-skill/tree/93d6a8cf16141216231e9020e666c3093ede3152/scripts)                       |

## 2. Why these sources have this precedence

The owner states that `ubiquity/ts-template` is canonical, `ai.ubq.fi` is the
complex Deno reference, and `0x4007/gpt-pro-skill` is the simpler reference. That
ordering is the rationale: the template defines the baseline preferences; each
Deno repository records what happened when that baseline met a real Deno codebase.
Neither Deno repository is canonical for style, and neither is a template to copy
wholesale. The user's explicit request and target-repository decisions always
outrank all three.

## 3. Measured project exceptions

All numbers are historic measurements from the pinned commits. Use them to judge
whether a condition applies to a target; do not treat them as targets.

### Canonical template

- No known measured exceptions; the canonical config is short and direct.
- Inventory only, not mandatory for every request: CSpell, Husky, lint-staged,
  commitlint.

### Gateway profile (ai.ubq.fi)

| Exception                                                 | Measurement                                                                           |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `func-style` allows arrows                                | 2944 findings, all `const fn = () => {}`                                              |
| Boolean naming selector disabled                          | 323 variables, 173 distinct names                                                     |
| `variableLike` filter `^_`                                | 205 findings, mostly unused `_`-prefixed parameters                                   |
| `consistent-type-definitions: "type"`                     | Interface autofix broke two `deno check` checks via missing implicit index signatures |
| `restrict-template-expressions` allows number/boolean     | 479 of 613 findings                                                                   |
| `no-unnecessary-type-assertion` off                       | 406 assertions autofixed, 7 removals failed `deno check` / `deno test`                |
| `sonarjs/no-empty-test-file` off                          | 1148 `Deno.test` tests; 97 real test files flagged as empty                           |
| `no-empty` allows empty catch                             | 11 intentional cleanup/teardown catches                                               |
| `max-lines` off                                           | 34 files over 1000 lines; largest 9597 and 13595 lines                                |
| `no-empty-function` allows arrows (plus methods in tests) | 94 findings, mostly `.catch(() => {})` and abort placeholders                         |
| `@typescript-eslint/no-unsafe-*` off                      | Incomplete `any` cleanup; explicitly not a desired default                            |
| `@types/node` pinned exactly 25.6.0                       | Matching the Deno checker's own Node declarations surfaced 624 additional findings    |
| Five file-scoped rule exemptions                          | Deliberate-by-design cases listed in [deno.md](deno.md) section 8                     |

### Simple profile (gpt-pro-skill)

| Exception                                       | Measurement                                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Boolean naming replaced by `booleanNamePattern` | 34/34 idiomatic booleans accepted, 14/15 junk rejected; canonical prefix matching also misread `cancelled` as `can` + `celled` |
| `variableLike` filter `^_$`                     | Bare `_` placeholder exemption                                                                                                 |
| `max-lines: ["warn", { max: 1000 }]`            | Kept as a warning rather than the gateway's off                                                                                |
| `no-empty-function` allows methods              | Intentional no-op browser-shim methods                                                                                         |
| Three file-scoped test exemptions               | Clear-text protocol, encryption mode, `no-extend-native` patching; each has a documented reason                                |

The simple profile retains the canonical `func-style` policy:
`"func-style": ["warn", "declaration", { allowArrowFunctions: false }]`. Only the
gateway sets `allowArrowFunctions` true.

## 4. Source-document drift

Recorded disagreements, verified against the pinned trees:

- **The referenced `.guidebook/LINTING.md` is absent.** `tools/lint/README.md` and
  the Deno config comments cite it, but the path does not exist at the pinned
  gpt-pro-skill commit and has no history in the local clone used to write this
  skill. Do not claim it was read or rely on its contents.
- **The Deno configs describe themselves as the template ruleset, but are not.**
  Both Deno configs add `strictTypeChecked` and `stylisticTypeChecked`; the
  canonical template extends only the recommended presets. The canonical preset is
  recommended, not strict.
- **The 1000-line ceiling attribution.** The gateway comment calls `max-lines` "the
  template's 1000-line ceiling", but the canonical template config sets no
  `max-lines` rule at all. The simple Deno reference sets it as a `warn`. Treat the
  ceiling as a profile recommendation and verify it in the target.
- **`"*.ts"` in `fmt.exclude` does not exclude nested files.** The gateway README
  records that earlier documentation said `"*.ts"` and that `"**/*.ts"` is the
  working pattern. Older guidance is wrong.
- **Dotfile globs need explicit entries.** `*` does not match a leading dot, so
  `.deno-types.d.ts` needs its own `fmt.exclude` and `lint.exclude` entries.
- **Canonical Knip ignores name undeclared packages.** `.github/knip.ts` lists
  `eslint-config-prettier` and `eslint-plugin-prettier` in `ignoreDependencies`,
  but the template's `package.json` declares neither. Inherited ignore lists can be
  stale; verify each entry against the manifest.
- **The template CSpell workflow installs its own copy.** The workflow runs
  `bun add cspell` before `bun run format:cspell` instead of relying on the locked
  devDependency.
- **Template CI does not run ESLint or Prettier checks.** Its workflows cover
  build, tests, CSpell, Knip, Cypress, conventional commits, and deploy/release
  only. A green CI is not evidence of lint or format cleanliness.
- **The simple profile's verify wrapper omits `deno fmt --check`.** The gateway's
  wrapper includes it. Check each wrapper's actual gate list before reporting
  coverage.
- **Version drift.** Canonical: ESLint `9.14.0`, SonarJS `^2.0.4`, Knip `^5.62.0`,
  TypeScript `^5.9.2`, `@types/node ^20.19.9`. Simple and gateway: ESLint `^10.10.0`,
  SonarJS `^4.2.0`, Knip `^6.35.1`, TypeScript `~6.0.3`. Pinned versions are dated
  evidence; choose a mutually compatible set from the target's lockfile.
- **The empty-string plugin was dropped, not replaced.** Canonical uses
  `@ubiquity-os/eslint-plugin-no-empty-strings` at `warn`; both Deno references
  omit it and have no equivalent coverage.
- **The boolean naming rule has three documented outcomes**: canonical prefix list,
  the simple profile's measured `booleanNamePattern`, and the gateway's decision to
  disable the selector. Treat the rule as target-sensitive rather than settled.
- **`^_` unused names conflict with canonical naming.** `no-unused-vars` accepts
  `^_`, while `variableLike: strictCamelCase` has no filter, so canonical rules
  disagree with each other. The filter adaptation is the measured resolution; it is
  not a reason to rename deliberately unused names.
