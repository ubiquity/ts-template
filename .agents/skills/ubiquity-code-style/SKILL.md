---
name: ubiquity-code-style
description: Use when adopting, auditing, or repairing the owner's TypeScript code-quality setup - Prettier, ESLint, CSpell, Husky/lint-staged, commitlint, or Knip - in a Node, Bun, or Deno repository, including the Ubiquity ts-template canonical ruleset and the measured Deno adaptations in ai.ubq.fi and gpt-pro-skill. Not for UI design.
---

# Ubiquity code style

Instruction-only skill: no scripts, no private tool, no network requirement. It
carries the owner's TypeScript code-quality baseline and the measured Deno
adaptations so an agent can adopt, audit, or repair the setup in a target
repository.

## Purpose

Apply the canonical Prettier, ESLint, CSpell, Husky/lint-staged, commitlint, and
Knip setup, or assess an existing one. Keep three layers separate, and say which
layer each change belongs to:

1. **Baseline preferences** - the canonical settings in
   [references/canonical-style.md](references/canonical-style.md).
2. **Runtime mechanics** - how a toolchain is installed, resolved, and invoked in
   this target. Deno mechanics are conditional; read
   [references/deno.md](references/deno.md) only when the target uses Deno.
3. **Repository-specific exceptions** - measured adaptations and deliberate
   suppressions. Never export one repository's exceptions as a universal default.
   Measured evidence lives in
   [references/sources-and-exceptions.md](references/sources-and-exceptions.md).

This is code style and tooling, not UI design.

## Source authority

- Canonical: `ubiquity/ts-template` at `59dc49340e5f091ab8ec06d009afaab3ffdcb8d6`.
- Complex Deno reference (gateway profile): `ubiquity/ai.ubq.fi` at
  `e6501a44646c29d099ad901fb343e95960536576`.
- Simple Deno reference (simple profile): `0x4007/gpt-pro-skill` at
  `93d6a8cf16141216231e9020e666c3093ede3152`.
- Precedence: the user's explicit request and target-repository decisions outrank
  this skill. Canonical settings are the default; the Deno references are evidence
  of what those repositories measured, not universal mandates.
- Pinned versions in the references are dated evidence, not latest versions.
  Select mutually compatible versions from the target's own manifest and lockfile.
- Exact public permalinks and source-document drift:
  [references/sources-and-exceptions.md](references/sources-and-exceptions.md).

## Modes

Choose one mode before acting and name it in the handback.

| Mode      | Use when                                                           | Output                                                   |
| --------- | ------------------------------------------------------------------ | -------------------------------------------------------- |
| `inspect` | A read-only assessment is explicitly requested                     | Findings, risks, and a proposed delta; no writes         |
| `adopt`   | The target has no equivalent setup, or the user asks to install it | The smallest coherent config for the target runtime      |
| `check`   | The setup exists and the user wants status                         | Non-mutating report from the target's own check commands |
| `fix`     | The user asks to repair findings                                   | Real fixes plus verification; behavior preserved         |

A read-only assessment requested by the user stays an assessment. Inspection is
the first step inside `adopt` and `fix` when the target is unfamiliar; an
authorized adoption or repair continues through its acceptance checks instead of
stopping at the assessment, and does not add approval gates. A small code edit
never triggers a repository-wide migration, and a request to check is not
permission to rewrite configuration.

## Workflow

1. **Inspect the target first.** Read the package manifest, lockfile, existing
   formatter and linter configs, tsconfig files, CI workflows, and hooks. Check
   real file-glob matches instead of assuming them, and note which tool already
   owns which file types.
2. **Preserve what exists.** Keep the target's runtime, tool ownership, scripts,
   versions, and explicit decisions unless the user asks to change them. Preserve
   warning/error severities.
3. **Decide the delta.** Compare against the canonical baseline, then apply only
   the gaps the request covers. Prefer a narrow change over replacing whole
   configs or rewriting unrelated code.
4. **Apply with clear ownership.** Each formatted file type must be owned by
   exactly one formatter, including dotfiles and JSX/TSX when present. Prettier's
   160-column TypeScript style is the canonical preference; it does not set the
   width of a different formatter such as `deno fmt` at its existing width.
5. **Check before fixing.** Separate non-mutating checks from `--fix`/`--write`
   commands. Existing `format` scripts mutate. Bootstrap or install steps may
   change `node_modules` even for a check; say so before running them.
6. **Verify.** Run the target's actual gates after any fix: formatter check,
   ESLint, Knip, native lint, typecheck, and relevant tests. Keep failure output
   intact and report honestly, including gates that did not run. If the host has
   an evidence-collection convention, follow it; this skill needs no private tool.

## Non-negotiable practices

- Do not use `eslint-disable`, `@ts-ignore`, or `as any` as lint escapes. If a
  finding is deliberate, add a narrow config exception with measured evidence.
  Assertions required by a native checker remain valid.
- Do not blindly delete exports Knip cannot trace, and do not add ignores without
  real usage evidence.
- Do not silently change CI or hook behavior. Report coverage honestly when CI
  enforces less than the local toolchain.
- Invoke locally installed binaries. `npx` cannot make config-relative plugin
  imports resolve.
- Do not make approval prompts a routine part of applying this skill; report
  decisions and evidence instead.

## References and assets

| Read                                                                         | When                                                                    | Contents                                                                 |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [references/canonical-style.md](references/canonical-style.md)               | Before any Prettier, ESLint, naming, severity, or Knip decision         | Exact canonical ruleset, naming selectors, tool roles, Node/Bun setup    |
| [references/deno.md](references/deno.md)                                     | Only when the target uses Deno, or the user asks to migrate it          | Simple and gateway profiles, formatter ownership, type generation, traps |
| [references/sources-and-exceptions.md](references/sources-and-exceptions.md) | Before citing authority, exceptions, or versions                        | SHA permalinks, measured exceptions, source-document drift               |
| [assets/prettier.json](assets/prettier.json)                                 | The target has no Prettier config, or canonical formatting is requested | Copyable canonical Prettier values; copying installs and wires nothing   |

## Evidence handback

Report concisely:

- Mode used and the profile chosen (Node/Bun, simple Deno, or gateway Deno).
- Files changed, and which layer each change belongs to.
- Exceptions or deliberate suppressions, each with its measurement.
- Commands executed and their outcomes; gates that were not run.
- Remaining concerns or decisions the user still owns.
