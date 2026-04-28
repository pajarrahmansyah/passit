# Changelog

All notable changes to PassIt will be documented here.

## [0.0.3] - 2026-04-28

### Added
- Added `apps/docs`, a standalone Next.js documentation site with MDX pages for getting started, configuration, route handlers, features, API reference, security, and troubleshooting.
- Added `apps/example`, a standalone Next.js demo app covering PassIt route handlers, multi-service config, header merging, normalization, response transforms, retry/timeout behavior, text responses, and the optional axios adapter.

### Changed
- Updated docs content to match the current package contract, including `createPassIt`, typed `defineConfig` return values, optional `req`, retry behavior, and HTML response handling.
- Simplified package build output by letting `tsup` generate bundled declarations for the public entry points.
- Enabled JS minification for published package builds.
- Removed the old declaration alias rewrite script because bundled declaration output no longer needs it.
- Remove unnecessary part bundled for published package builds 

## [0.0.2] - 2026-04-27

### Added
- `createPassIt(config)` factory for route-safe config binding without relying on global registration
- `PassItOptionsSingle` and `PassItOptionsMulti<TService>` exported types — enforces `service` key at compile time based on what was passed to `defineConfig`
- `defineConfig` now returns a typed `passIt` function: single-service configs produce `PassItOptionsSingle` (no `service` allowed), multi-service configs produce `PassItOptionsMulti<keyof T>` (`service` required and constrained to registered keys)
- New `src/core/config-store.ts` module — owns the global config singleton (`setConfig`, `getConfig`, `isMultiService`) to eliminate the circular dependency between `defineConfig` and `passIt`

### Changed
- `tsup.config.ts` — added explicit `outExtension` so CJS output always uses `.cjs` and ESM output always uses `.js`, preventing silent `.mjs` regressions that would break `require()` consumers
- `passIt` internal type simplified: removed redundant `PassItOptionsInternal` alias; internal signatures now use `PassItOptionsAll = PassItOptionsSingle | PassItOptionsMulti<string>`
- `src/utils/forwardRequest.ts` — body is now read with `await req.text()` instead of `JSON.stringify(req.body)`, fixing silent body corruption for non-JSON and streaming payloads
- `src/core/passIt.ts` — header merge order corrected to `mergeHeaders(serviceConfig.headers, options.headers)` so per-route headers properly override global service headers
- `src/next/plugin.ts` — implemented `withPassIt` Next.js config wrapper (enables `instrumentationHook` for Next.js 14 compatibility) and `register` export for `instrumentation.ts` that auto-imports `passit.config` at server startup

### Fixed
- Config registered by `instrumentation.ts` now uses `globalThis` storage so App Router route handlers can resolve it across separate server module graphs
- ESM consumers importing from `@pajarrahmansyah/passit` would silently receive `.mjs` bundles in some toolchains — resolved by pinning output extensions in `tsup.config.ts`
- Request body was serialised as `"[object ReadableStream]"` when proxying POST/PUT/PATCH — resolved by awaiting `req.text()`
- Route-level headers were being overridden by global config headers instead of the reverse

## [0.0.1] - 2026-04-25

### Added
- Initial release
- `defineConfig` — single and multi service config
- `passIt` — main proxy function for Next.js Route Handlers
- Auto forwarding of query params, headers, and request body
- Timeout support with `number | false` and per route override
- Retry logic with configurable status codes and backoff
- Response normalization for success and error responses
- Hooks system with dev/prod environment separation
- fetch and axios adapter support
- Next.js plugin via `@pajarrahmansyah/passit/next`
- Full TypeScript support
