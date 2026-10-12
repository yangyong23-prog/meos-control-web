---
name: production-build-guard
description: MUST be used before selecting verification commands or running any production build during coding tasks. Prevent unrequested production builds such as npm/pnpm/yarn build scripts, vite build, webpack production builds, framework production builds, report/release/package compilation, and equivalent full production bundling. Trigger whenever Codex is finishing an implementation, choosing validation steps, or considering a build command.
---

# Production Build Guard

## Core Rule

Do not run a production build unless the user or an applicable task instruction explicitly requires it.

Treat requests such as "verify", "check", "finish", "implement end to end", or "make sure it works" as insufficient authorization for a production build unless they specifically mention building or a production-build command.

## Authorization

Run a production build only when at least one condition is true:

- The user explicitly asks to run a production build or names the build command.
- A higher-priority instruction explicitly requires a production build for the current task.
- The task itself is explicitly about executing, fixing, or diagnosing a production build.

Do not infer authorization from:

- A frontend or application code change.
- A generic requirement to verify work before completion.
- The presence of a `build` script in `package.json`.
- Habit, completeness, confidence, or a desire for broader validation.

## Production Build Scope

Treat commands as production builds when they create or validate the full production bundle, distribution, report bundle, release artifact, or equivalent compiled output. Examples include:

- `npm run build`, `pnpm build`, or `yarn build`.
- `vite build`, `webpack --mode production`, `next build`, or `nuxt build`.
- Project-specific `build:*`, `report`, `release`, `dist`, or packaging commands that perform a full production compilation.

Targeted checks are not production builds. Prefer them when they match the changed surface:

- Lint only the changed files.
- Run focused unit or integration tests.
- Run a type check without bundling.
- Run syntax checks or `git diff --check`.

## Workflow

1. Inspect the request and applicable instructions for explicit production-build authorization.
2. If authorized, state the authorization briefly before running the build.
3. If not authorized, do not run the build. Select the smallest relevant non-build verification.
4. If only a production build can verify an important claim, report that it was not run and request authorization instead of running it.
5. In the final response, mention that no production build was run only when it is relevant to the verification status.
