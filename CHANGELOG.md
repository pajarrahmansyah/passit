# Changelog

All notable changes to PassIt will be documented here.

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