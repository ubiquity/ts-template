# Deno integration

Read this only when the target uses Deno, or when the user explicitly asks to
migrate a Deno repository to this code-quality setup. A Deno repository runs two
toolchains: Deno's own `deno fmt` / `deno lint` / `deno check` / `deno test`, plus
the Node-based ESLint, Prettier, and Knip stack. Ownership and type resolution must
therefore be explicit, or the two toolchains fight.

Reference implementations (exact permalinks in
[sources-and-exceptions.md](sources-and-exceptions.md)):

- Simple profile: `0x4007/gpt-pro-skill` at `93d6a8cf16141216231e9020e666c3093ede3152`.
- Gateway profile: `ubiquity/ai.ubq.fi` at `e6501a44646c29d099ad901fb343e95960536576`.

Both are Deno implementations of the [canonical ruleset](canonical-style.md) with
measured local changes. They are evidence, not defaults.

## 1. Choose the profile from the repository shape

|                      | Simple profile                                                                        | Gateway profile                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Toolchain location   | Dev toolchain at the repository root                                                  | Root `package.json` is metadata only with **no dependencies**; tooling, ESLint config, and installs live in `tools/lint/` |
| `nodeModulesDir`     | `"manual"`                                                                            | `"none"`                                                                                                                  |
| `node_modules` owner | exactly one package manager owns root `node_modules`                                  | only `tools/lint/node_modules`; Deno never reads it                                                                       |
| Use when             | Small Deno repo or skill; no JSR dependency pulls npm packages through the root graph | Deno app whose JSR dependencies transitively require npm packages                                                         |

Why the gateway profile exists: when a JSR dependency graph includes npm packages,
a root manifest that declares dependencies makes Deno resolve through
`node_modules`. CI runs `deno task build` and `deno task test` with `--frozen` and
no install step, so a fresh checkout fails with "Could not find a matching package
... run `deno install`". Keeping the root manifest dependency-free and the
toolchain in `tools/lint/` leaves Deno's resolution exactly as it was, because Deno
walks module resolution upward from each source file and never sideways into
`tools/lint/`.

This layout is scoped to preserving those frozen, cache-only builds with no npm
install step. A Deno repository that already works under a different
`nodeModulesDir` policy must be assessed and preserved unless changing it is
needed for the requested result. When changing a layout, do not end up with two
package managers owning one `node_modules`, and do not declare dev tooling
dependencies at the root of a Deno app whose JSR graph pulls npm packages.

## 2. Formatter ownership

Exactly one formatter owns each file type, verified against the target's real
files. The split below is the **gateway recipe**, measured in that repository; it
is not a verified universal profile, and the simple profile's verify wrapper does
not run `deno fmt --check`, so do not cite it as evidence for this exact split.

- **Prettier** owns `*.ts` and `*.mjs` using the canonical 160-column config
  (`../assets/prettier.json`). In the gateway this is enforced by `.prettierignore`.
- **`deno fmt`** owns JSON, JSONC, Markdown, CSS, HTML, and static browser JS at
  its existing `lineWidth: 120`. Do not turn 160 into a universal Deno width.
- When the target has `.tsx`/`.jsx`, assign them explicitly to one formatter
  (normally Prettier beside `*.ts`) and exclude them from the other.

Gateway `deno.json` fragments that enforce the split:

```jsonc
{
  "nodeModulesDir": "none",
  "fmt": {
    "lineWidth": 120,
    "semiColons": true,
    "exclude": [
      "benchmarks/fixtures",
      "**/*.ts",
      "**/*.mjs",
      ".deno-types.d.ts",
      ".codex-worktrees",
      ".data",
      ".release",
      ".kv-migration",
      ".sentinel",
      ".diagnostics",
      "logs",
      "benchmark-runs",
      "lib",
      "node_modules",
    ],
  },
  "lint": {
    "exclude": [
      "node_modules",
      "lib",
      ".codex-worktrees",
      ".data",
      ".release",
      ".kv-migration",
      ".sentinel",
      ".diagnostics",
      "logs",
      "benchmark-runs",
      "**/*.d.ts",
      ".deno-types.d.ts",
    ],
    "rules": { "exclude": ["no-empty"] },
  },
}
```

Traps, both measured:

1. `"*.ts"` in `fmt.exclude` is root-relative and silently excludes only root-level
   files, which is to say almost nothing. Use `"**/*.ts"` for nested coverage.
   Older documentation said `"*.ts"`; that guidance is wrong.
2. Glob `*` does not match a leading dot, so the generated `.deno-types.d.ts` needs
   its own explicit entry in `fmt.exclude` and `lint.exclude` in addition to any
   `**/*.d.ts` pattern.

Inspect real glob matches before trusting any ignore list.

## 3. A separate lint program: `tsconfig.lint.json`

A root `tsconfig.json` is not forbidden in every Deno project. In the gateway
profile it is deliberately absent: Deno auto-detects a root `tsconfig.json` even
when `deno.json` exists and adopts its `compilerOptions`, which can break
`deno check` in that frozen build. When a lint-only program is needed, give ESLint
its own `tsconfig.lint.json`; do not overwrite an existing runtime/build
`tsconfig.json` that the target depends on, and do not add or migrate a program
the target does not need. The separate program also keeps runtime compiler
options from interfering with the lint program's types.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "forceConsistentCasingInFileNames": true,
    "typeRoots": ["./tools/lint/node_modules/@types"],
    "types": ["node"],
    "skipLibCheck": true
  },
  "include": ["serve.ts", "src/**/*.ts", "tests/**/*.ts", "scripts/**/*.ts", "benchmarks/**/*.ts", "ops/**/*.ts", ".deno-types.d.ts"]
}
```

Adjust `include` to the target's real source, test, script, ops, and benchmark
directories. When the target has `.tsx`/`.jsx`, add those extensions to `include`
and set a JSX compiler option matching the runtime (for example
`"jsx": "react-jsx"`); the TS/MJS example above does not cover those extensions
automatically. The simple profile keeps the same compiler options without the
`typeRoots`/`types` entries and includes only its own source path plus
`.deno-types.d.ts`; add the Node type entries only when the lint program actually
uses Node APIs.

When the config lives in `tools/lint/` but lints the repository root, set
`tsconfigRootDir` explicitly in the ESLint config:

```js
tsconfigRootDir: path.resolve(import.meta.dirname, "../.."),
```

and keep `project: ["./tsconfig.lint.json"]` relative to that root.

## 4. Generated Deno ambient types

`deno types > .deno-types.d.ts` writes the ambient declarations the type-aware
rules need (roughly 23k lines in the gateway). Rules:

- Regenerate it **before** ESLint runs, in every script path that lints, not only
  in the full verify wrapper.
- Keep it untracked and excluded from both formatters and linters, with the
  explicit dotfile entry from section 2.
- If the file is missing, type-aware rules report **fewer** findings without
  erroring. That silent coverage loss is the failure mode to avoid.

## 5. Node types in the lint program

- The lint program needs real `node:` and Web API types. TypeScript's default
  `typeRoots` walk from the tsconfig's directory cannot see an install under
  `tools/lint/node_modules`, so declare both `typeRoots` and `types` explicitly.
- Match the declarations the **Deno checker** actually resolves, verified with
  `deno info`, not a runtime's advertised Node compatibility major and not
  `latest`. The gateway pinned `@types/node` to `25.6.0` exactly for this reason.
- Historic measurement: turning on those types re-typed test fixtures and made
  **624** additional findings visible, mostly fixture literals such as
  `"eligible" !== "eligible"`. Those findings were handled as their own change.
  Treat the number as historic, not a target to reproduce.
- Missing or mismatched types silently reduce findings. Never accept an
  unexplained drop in findings after a type configuration change.
- `ReturnType<typeof setTimeout>` still degrades to `any` in the lint program
  while `deno check` types it as an opaque `Timeout`. Prefer
  `Parameters<typeof clearTimeout>[0]` when a timer handle needs a name; it
  satisfies both programs.

## 6. Exclusions

Exclude only vendor, generated, release, and worktree material, for example
`node_modules/`, `lib/` (vendored submodule), generated `*.d.ts`, `.data/`,
`.release/`, `.codex-worktrees/`, scratch migration directories, logs, and
benchmark runs. Do not exclude `src/`, `tests/`, `ops/`, `scripts/`, or
`benchmarks/` to hide findings; that removes real coverage.

## 7. SonarJS major-version mapping

The Deno references use `eslint-plugin-sonarjs` v4 while the canonical template
uses v2. Upgrading is not a drop-in: v4 deletes some v2 rules and turns others off
in its recommended preset. Diff the rule sets and map each one explicitly; do not
accept silent coverage loss.

| Situation                                                                                                                                                                                                                                      | v4 action taken by the gateway                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| v2 rule deleted in v4 (`no-extend-native`, `new-cap`, `default-case`, `no-var`, `no-self-compare`, `no-useless-escape`)                                                                                                                        | Restored from ESLint core as explicit `error`                            |
| v2 rule still shipped but off in v4 recommended (`os-command`, `no-unsafe-unzip`, `confidential-information-logging`, `no-ip-forward`, `frame-ancestors`, `no-mixed-content`, `hidden-files`, `no-intrusive-permissions`, `no-commented-code`) | Restored to explicit `error`                                             |
| Duplicate coverage: `sonarjs/prefer-regexp-exec`, `sonarjs/deprecation`                                                                                                                                                                        | Turned off where the type-aware TypeScript rule supersedes them          |
| Duplicate reporting: `no-nested-ternary` versus `sonarjs/no-nested-conditional`                                                                                                                                                                | Keep one; the gateway kept the sonarjs rule and dropped the core rule    |
| `sonarjs/no-empty-test-file`                                                                                                                                                                                                                   | Off for `Deno.test`-based suites, which the rule cannot see              |
| `no-empty`                                                                                                                                                                                                                                     | `allowEmptyCatch: true`, with `deno lint`'s `no-empty` excluded to match |

The six `sonarjs/no-*` rules the canonical config sets explicitly
(`no-all-duplicated-branches`, `no-collection-size-mischeck`,
`no-duplicated-branches`, `no-element-overwrite`, `no-identical-conditions`,
`no-identical-expressions`) stay explicit `error` in both major versions.

## 8. Measured rule adaptations

The gateway's adaptations, each with the measurement that justified it. Apply one
only when the target hits the same condition, and record the target's own numbers.

| Rule                                               | Gateway decision                                                    | Measurement                                                                                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `func-style`                                       | `allowArrowFunctions: true`                                         | Canonical `false` produced 2944 findings, all the repo's `const fn = () => {}` idiom                                                                                       |
| `naming-convention` boolean selector               | Disabled                                                            | 323 boolean variables across 173 distinct names; any regex accepting them accepts everything                                                                               |
| `naming-convention` `variableLike`                 | `filter: { regex: "^_", match: false }`                             | 205 findings, almost all deliberately unused `_ctx`/`_input`/`_signal` parameters; aligns the rule with `argsIgnorePattern: "^_"`                                          |
| `@typescript-eslint/consistent-type-definitions`   | `"type"`                                                            | The preset default `"interface"` autofix broke two `deno check` type checks because interfaces lack an implicit index signature                                            |
| `@typescript-eslint/restrict-template-expressions` | `allowNumber` and `allowBoolean`                                    | 479 of 613 findings; objects, symbols, nullish, and `any`/`unknown` stay reported                                                                                          |
| `@typescript-eslint/no-unnecessary-type-assertion` | Off                                                                 | Its autofix removed 406 assertions and 7 removals failed `deno check` / `deno test`; the lint program's types do not reproduce Deno's checker exactly                      |
| `sonarjs/no-empty-test-file`                       | Off                                                                 | 1148 `Deno.test` tests; the rule flagged 97 real test files as empty                                                                                                       |
| `no-empty`                                         | `allowEmptyCatch: true`                                             | All 11 findings were intentional cleanup/teardown catch blocks                                                                                                             |
| `max-lines`                                        | Off                                                                 | 34 files over 1000 lines, including 9597 and 13595-line modules; satisfying it is an architecture refactor                                                                 |
| `@typescript-eslint/no-empty-function`             | `allow: ["arrowFunctions"]`, plus `methods` in tests and benchmarks | 94 findings (historic), mostly `.catch(() => {})` and abort placeholders; empty declarations and production methods still report, while test/benchmark methods are allowed |
| `@typescript-eslint/no-unsafe-*` family            | Off                                                                 | Explicitly disabled in these migrations because the `any` sources are not cleaned up yet. This is incomplete coverage, not a desired universal default                     |

File-scoped exemptions are acceptable only with inline evidence. The gateway has
five: `sonarjs/redundant-type-aliases` in `src/defaults.ts`,
`sonarjs/function-return-type` in `src/codex_models.ts`,
`sonarjs/no-clear-text-protocols` in one test where the clear-text URL is the
subject under test, `sonarjs/no-hardcoded-secrets` in three tests using verified
fake credentials, and a wider `no-empty-function` allowance in tests/benchmarks.

Do not summarize these exceptions as proof of fully strict checking. They are
deliberate gaps with measurements.

The in-house `@ubiquity-os/eslint-plugin-no-empty-strings` rule is intentionally
omitted from both Deno references. Do not claim equivalent coverage for empty
strings there.

## 9. Knip in a Deno repository

- List the target's actual executable and test entry points, for example a server
  entry plus `scripts/**`, `ops/**`, `benchmarks/**`, and test patterns; map
  `project` to all real source directories.
- By default Knip does not report entry exports as unused
  ([`includeEntryExports`](https://knip.dev/reference/configuration#includeentryexports)).
  Set `includeEntryExports: true` only for a self-contained private app whose
  entry-point exports should be checked. A published package whose exports are used
  outside the repository normally leaves it false or omitted and protects the
  public surface through `entry`/public-API configuration; never delete public
  library exports merely because no internal import uses them.
- When the target has `.tsx`/`.jsx`, include those extensions in `project`, entry,
  and test patterns; the gateway TS/MJS examples do not cover them automatically.
- Knip does not read `deno.json#imports`, so JSR import-map specifiers it cannot
  resolve are legitimately listed in `ignoreDependencies`, with that reason
  recorded.
- Runtime-constructed dynamic imports (for example `await import(new URL(...))`)
  cannot be traced; keep bounded `ignoreIssues` entries for the affected files
  with the importing call site named. Do not expand them into allowlists.
- Do not copy the gateway's filenames or ignore lists into another repository.

## 10. Checks, fixes, and verification

Separate non-mutating checks from mutating commands:

- Checks: `prettier --check .`, `eslint .` (no `--fix`), `knip`,
  `deno fmt --check`, `deno lint`, `deno check` / `deno task build`, tests.
- Mutating: `prettier --write .`, `eslint --fix .`, `knip --fix`,
  `deno fmt`, `deno task format` (the gateway `format` script writes).
- Bootstrap may install dependencies even when only checking; say so before
  running it.
- Install in the toolchain directory but run checks from the repository root,
  invoking those binaries by path. Inside `tools/lint/`, `eslint .` would check
  `tools/lint` instead of the repository. Gateway examples after type generation:
  ```sh
  deno task types
  tools/lint/node_modules/.bin/eslint --config tools/lint/eslint.config.mjs .
  tools/lint/node_modules/.bin/prettier --check .
  tools/lint/node_modules/.bin/knip --config knip.json
  ```
  Adapt the target's existing tasks rather than requiring a new CLI interface.
  `npx` cannot resolve config-relative plugin imports.
- A full verification run regenerates the Deno types first, runs every gate even
  after a failure, and exits non-zero if any failed. Type generation counts as a
  gate.
- After any `--fix`, run `deno check` / `deno task build` and the tests. Deno is
  the authority on whether a type-aware fix is still correct.
- Validation trap for the gateway profile: never delete an existing real user
  `node_modules` or discard dirty work to simulate a fresh checkout. Use a separate
  clean clone or worktree for that check.
- Keep security, auth, and money-path tests proportionate, and use the target's
  existing approved interfaces rather than inventing new ones.

Existing CI is distinct from local checks. Neither the template nor the gateway CI
enforces every lint tool; the gateway's local verify wrapper is broader than CI.
Report actual coverage honestly, and do not change CI behavior as part of a style
migration unless the user asks.
