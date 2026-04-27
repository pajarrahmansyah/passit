# AGENTS.md

This file describes the `apps/` folder in the PassIt repository.

## Apps Overview

`apps/` contains standalone Next.js projects that support the root npm package:

- `docs/` is the online documentation website.
- `example/` is the demo app for showing PassIt in action.

The root repository is still the npm package source. App changes should not move
package code out of `src/` or redefine package behavior in app-only helpers.

## Important Boundary

The apps are not currently configured as npm workspaces. Each app has its own
`package.json`, `package-lock.json`, and dependency tree.

Run commands from the relevant app directory:

```bash
cd apps/docs && npm run dev
cd apps/docs && npm run build

cd apps/example && npm run dev
cd apps/example && npm run build
```

Do not assume a root `npm install` installs app dependencies, and do not assume an
app `npm install` updates the root package lock.

## Vercel Git Deployments

`apps/docs` and `apps/example` are intended to be deployed as separate Vercel
projects from the same Git repository. Configure each Vercel project with its
Root Directory set to the matching app folder:

- Docs project: `apps/docs`
- Example project: `apps/example`

Each app has a local `vercel.json` with:

```json
{
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./"
}
```

For Vercel Git Integration builds, this means:

- Root package-only changes do not deploy docs or example.
- `apps/docs/**` changes deploy only the docs project.
- `apps/example/**` changes deploy only the example project.

If an app begins depending on shared files outside its app directory at build
time, update that app's `ignoreCommand` to include those paths intentionally.

## apps/docs

`apps/docs` is the public documentation site for PassIt.

### Purpose

- Explain how to install, configure, and use `@pajarrahmansyah/passit`.
- Document public APIs, supported options, route handler patterns, and security notes.
- Keep documentation aligned with the root package implementation and README.

### Structure

```
apps/docs/
|-- content/docs/             # MDX documentation pages
|-- src/app/                  # Next.js App Router routes/layouts
|-- src/components/           # documentation UI components
|-- src/lib/                  # docs loading and utility code
|-- next.config.ts            # MDX-enabled Next config
`-- package.json
```

### Rules

- Prefer editing `content/docs/*.mdx` for documentation content.
- Keep examples accurate against the package API in root `src/`.
- Do not document internal package modules as public API.
- If a package behavior changes, update the relevant docs page in the same task.
- The docs app can have its own UI components, but reusable PassIt package logic
  belongs in root `src/`, not in `apps/docs`.

## apps/example

`apps/example` is the demo project for PassIt.

### Purpose

- Demonstrate real App Router route handler usage.
- Show common PassIt features through working API routes.
- Provide a simple local smoke-test surface for manual verification.

### Structure

```
apps/example/
|-- passit.config.ts          # demo PassIt configuration
|-- src/instrumentation.ts    # loads PassIt config before routes run
|-- src/app/api/              # demo route handlers using passIt()
|-- src/app/page.tsx          # demo UI
|-- src/components/           # demo UI components
`-- package.json
```

### Current Demo Coverage

- Basic proxying
- Dynamic paths
- Header merging
- JSON and text/HTML responses
- Normalized responses
- Response transformation
- Retry and timeout options
- Fetch and optional axios adapters

### Rules

- Route examples should use `@pajarrahmansyah/passit` like a real consumer app.
- Keep `passit.config.ts` focused on demo configuration, not package internals.
- Public test backends are acceptable for demo routes, but live network behavior
  should not be required by root unit tests.
- Update `apps/example/README.md` when routes, env vars, or demo coverage changes.
- If the demo exposes a newly added package feature, ensure the root package tests
  cover the behavior separately.

## Cross-App Guidance

- Keep docs and example language consistent with the package README.
- Avoid duplicating large explanations in both apps unless the user experience needs it.
- Use app-local dependencies only for app concerns.
- Keep generated build output and framework caches out of source changes.
- Do not run full `npm run build` checks for small docs copy edits, minor UI
  tweaks, or small example flow changes. Run a full build only for larger
  changes, dependency/config updates, routing/build behavior changes, or when a
  build is necessary to verify the requested work.
