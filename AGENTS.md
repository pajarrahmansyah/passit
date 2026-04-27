# AGENTS.md

This file describes the PassIt repository for AI coding assistants.

## Repository Overview

PassIt is now organized as a small monorepo:

- The repository root is the published npm package, `@pajarrahmansyah/passit`.
- `apps/docs` is the online documentation website.
- `apps/example` is a Next.js demo project that shows how the package is used.

The package remains the source of truth for PassIt behavior. The docs and example
apps should explain and demonstrate the package without redefining its runtime
contracts.

```
Client -> Next.js Route Handler (PassIt) -> Real Backend
```

## Root Package

The root package is a config-driven proxy gateway utility for Next.js App Router
Route Handlers. It proxies client requests to a real backend, handling headers,
retries, timeouts, error normalization, and logging.

### Tech Stack

- Language: TypeScript (strict mode)
- Runtime: Node.js >= 18
- Build: tsup
- Test: vitest
- Imports: `@/*` alias maps to `src/*`
- Target: Next.js App Router >= 14
- Package name: `@pajarrahmansyah/passit`

### Root Project Structure

```
passit/
|-- src/
|   |-- core/
|   |   |-- types.ts          # all TypeScript interfaces and types
|   |   |-- defineConfig.ts   # config registration, validation, singleton
|   |   `-- passIt.ts         # main proxy function, orchestrates everything
|   |-- adapters/
|   |   |-- fetchAdapter.ts   # fetch implementation
|   |   `-- axiosAdapter.ts   # axios implementation (optional)
|   |-- features/
|   |   |-- timeout.ts        # timeout resolution logic
|   |   |-- retry.ts          # retry with backoff logic
|   |   |-- normalize.ts      # response normalization
|   |   `-- hooks.ts          # logging hooks with env detection
|   |-- utils/
|   |   |-- mergeHeaders.ts   # header merging, PassIt wins on conflict
|   |   |-- forwardRequest.ts # extracts method, headers, body, params
|   |   `-- contentType.ts    # detects and parses response content type
|   |-- next/
|   |   `-- plugin.ts         # Next.js config plugin
|   `-- index.ts              # public exports only
|-- tests/
|   |-- unit/                 # unit tests grouped by area
|   |-- integration/          # opt-in live/public API tests
|   `-- tsconfig.json         # editor/project config for tests
|-- apps/
|   |-- docs/                 # online documentation website
|   `-- example/              # demo app that consumes the package
|-- scripts/
|   |-- rewire-dts-aliases.mjs
|   `-- run-live-tests.mjs
|-- tsconfig.test.json
`-- package.json
```

## Apps Workspace

`apps/` contains standalone Next.js projects with their own `package.json` and
`package-lock.json` files. This repository is not currently configured as npm
workspaces, so install and run app commands from the app directory unless a root
script is added later.

- `apps/docs`: documentation site for online usage guides and API reference.
- `apps/example`: demo project for local/manual verification of PassIt behavior.

See `apps/AGENTS.md` for app-specific guidance.

## Core Concepts

### Config flow

`defineConfig` stores config as a module-level singleton. `passIt` reads it via
`getConfig`. Config must be loaded before any route runs via `instrumentation.ts`,
root layout import, or Next.js plugin.

### Single vs multi service

```ts
// single service - no service key needed in passIt()
defineConfig({ baseUrl: "..." });

// multi service - service key required in passIt()
defineConfig({ auth: { baseUrl: "..." }, storage: { baseUrl: "..." } });
```

### Local overrides global

Every config option set at route level overrides the global config. Exception:
`http` is global only.

### Header merging

Client headers + PassIt config headers are merged. PassIt headers always win on
same key.

### Adapter pattern

`fetchAdapter` and `axiosAdapter` both return `AdapterResponse`, the same shape
regardless of HTTP library. The rest of PassIt never knows which adapter ran.

### Execution order in passIt()

```
resolveServiceConfig -> buildResolvedConfig -> forwardRequest
-> mergeHeaders -> buildUrl -> runRequestHooks
-> withRetry/adapterFn -> runResponseHooks
-> normalizeResponse -> options.response transformer
-> Response.json
```

## Key Rules

- `src/index.ts` is the only public package API; never export internals.
- `http` config is global only, never per route.
- `baseUrl` is required and cannot have a trailing slash.
- Use `@/...` imports for internal source references instead of deep relative paths.
- Retry only triggers on configured `onStatus` codes, never on 2xx or 4xx.
- `normalize` runs before `response` transformer; document this when relevant.
- axios is an optional peer dependency; never assume it is installed.
- All features are opt-in; PassIt has zero forced behavior.
- Keep docs and examples synchronized with the root package implementation.

## Types

All package types live in `src/core/types.ts`. When adding new features:

- Define the type there first.
- Export it from `src/index.ts` if it is part of the public API.
- Never define package types inline in feature files.

## Adding a Package Feature

1. Define types in `src/core/types.ts`.
2. Create a feature file in `src/features/`.
3. Import and wire it in `src/core/passIt.ts`.
4. Export types from `src/index.ts` if public.
5. Write unit tests under `tests/unit/` in the matching area.
6. Update README config reference table.
7. Update `apps/docs` documentation if the user-facing API changes.
8. Update `apps/example` when the feature should be demonstrated.

## Testing

Root package commands:

```bash
npm test
npm run test:unit
npm run test:live
npm run typecheck
npm run typecheck:tests
npm run build
```

- Unit tests live under `tests/unit/`.
- Live network tests live under `tests/integration/` and should stay opt-in.
- Use `vi.fn()` for mocking adapters in retry tests.
- Use `vi.useFakeTimers()` for tests involving backoff timing.
- Use `vi.stubEnv` for environment-dependent hook tests.

App commands are run inside the app directory:

```bash
cd apps/docs && npm run build
cd apps/example && npm run build
```

## Build Output

Root package build output goes to `dist/`. Two package entry points are emitted:

- `passit` -> `dist/index.js` / `dist/index.mjs`
- `passit/next` -> `dist/next/plugin.js` / `dist/next/plugin.mjs`

Do not treat `dist/` as source. Make changes in `src/`, then rebuild.

## Versioning

- `0.x.x` - pre-release, API may change.
- `1.0.0` - stable, Next.js App Router only.
- `2.0.0` - Pages Router support, staging env hooks.
- `3.0.0` - framework agnostic (planned).
