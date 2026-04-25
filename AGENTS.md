# AGENTS.md

This file describes the PassIt codebase for AI coding assistants.

## Project Overview

PassIt is a config-driven proxy gateway utility for Next.js App Router Route Handlers. It proxies client requests to a real backend, handling headers, retries, timeouts, error normalization, and logging.

```
Client → Next.js Route Handler (PassIt) → Real Backend
```

## Tech Stack

- Language: TypeScript (strict mode)
- Runtime: Node.js >= 18
- Build: tsup
- Test: vitest
- Target: Next.js App Router >= 14

## Project Structure

```
passit/
├── src/
│   ├── core/
│   │   ├── types.ts          # all TypeScript interfaces and types
│   │   ├── defineConfig.ts   # config registration, validation, singleton
│   │   └── passIt.ts         # main proxy function, orchestrates everything
│   ├── adapters/
│   │   ├── fetchAdapter.ts   # fetch implementation
│   │   └── axiosAdapter.ts   # axios implementation (optional)
│   ├── features/
│   │   ├── timeout.ts        # timeout resolution logic
│   │   ├── retry.ts          # retry with backoff logic
│   │   ├── normalize.ts      # response normalization
│   │   └── hooks.ts          # logging hooks with env detection
│   ├── utils/
│   │   ├── mergeHeaders.ts   # header merging, PassIt wins on conflict
│   │   ├── forwardRequest.ts # extracts method, headers, body, params from NextRequest
│   │   └── contentType.ts   # detects and parses response content type
│   ├── next/
│   │   └── plugin.ts         # Next.js config plugin
│   └── index.ts              # public exports only
└── tests/                    # mirrors src structure
```

## Core Concepts

### Config flow
`defineConfig` stores config as a module-level singleton. `passIt` reads it via `getConfig`. Config must be loaded before any route runs via `instrumentation.ts`, root layout import, or Next.js plugin.

### Single vs multi service
```ts
// single service — no service key needed in passIt()
defineConfig({ baseUrl: '...' })

// multi service — service key required in passIt()
defineConfig({ auth: { baseUrl: '...' }, storage: { baseUrl: '...' } })
```

### Local overrides global
Every config option set at route level overrides the global config. Exception: `http` is global only.

### Header merging
Client headers + PassIt config headers are merged. PassIt headers always win on same key.

### Adapter pattern
`fetchAdapter` and `axiosAdapter` both return `AdapterResponse` — same shape regardless of http lib. The rest of PassIt never knows which adapter ran.

### Execution order in passIt()
```
resolveServiceConfig → buildResolvedConfig → forwardRequest
→ mergeHeaders → buildUrl → runRequestHooks
→ withRetry/adapterFn → runResponseHooks
→ normalizeResponse → options.response transformer
→ Response.json
```

## Key Rules

- `src/index.ts` is the ONLY public API — never export internals
- `http` config is global only, never per route
- `baseUrl` is required, no trailing slash allowed
- Retry only triggers on configured `onStatus` codes, never on 2xx or 4xx
- `normalize` runs before `response` transformer — document this when relevant
- axios is an optional peer dependency — never assume it is installed
- All features are opt-in — PassIt has zero forced behavior

## Types

All types live in `src/core/types.ts`. When adding new features:
- Define the type there first
- Export it from `src/index.ts` if it's part of the public API
- Never define types inline in feature files

## Adding a New Feature

1. Define types in `src/core/types.ts`
2. Create feature file in `src/features/`
3. Import and wire it in `src/core/passIt.ts`
4. Export types from `src/index.ts` if public
5. Write tests in `tests/features/`
6. Update README config reference table

## Testing

```bash
npm run test:run    # run once
npm run test        # watch mode
```

- Tests mirror src structure under `tests/`
- Use `vi.fn()` for mocking adapters in retry tests
- Use `vi.useFakeTimers()` for tests involving backoff timing
- Use `vi.stubEnv` for environment dependent hook tests

## Build

```bash
npm run build       # production build
npm run dev         # watch mode
npm run typecheck   # type check only
```

Build output goes to `dist/`. Two entry points:
- `passit` → `dist/index.js` / `dist/index.mjs`
- `passit/next` → `dist/next/plugin.js` / `dist/next/plugin.mjs`

## Versioning

- `0.x.x` — pre-release, API may change
- `1.0.0` — stable, Next.js App Router only
- `2.0.0` — Pages Router support, staging env hooks
- `3.0.0` — framework agnostic (planned)