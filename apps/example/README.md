# PassIt Next.js 15 Example

A simple Next.js 15 App Router project that demonstrates the published
`@pajarrahmansyah/passit` feature set with Tailwind CSS.

## What It Covers

- Config-driven proxy routes with `defineConfig`
- Multi-service config keys
- `instrumentation.ts`, root config import, and `withPassIt`
- Server-side header injection
- Query/body forwarding through `NextRequest`
- Per-route timeout and retry overrides
- Normalized success/error responses
- Custom response transformation
- Request/response/error hooks
- `fetch` and optional `axios` adapters
- JSON and HTML/text backend response handling

## Routes

| Feature | Route |
| --- | --- |
| Basic proxy | `/api/basic?_limit=3` |
| Dynamic path | `/api/post/7` |
| Normalized response | `/api/normalized` |
| Response transform | `/api/transform?_limit=8` |
| Header merge | `/api/headers` |
| HTML/text handling | `/api/text` |
| Retry + timeout | `/api/retry-timeout` |
| Axios adapter | `/api/axios` |

## Getting Started

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Configuration

The demo defaults to public test backends:

```bash
PASSIT_JSONPLACEHOLDER_URL=https://jsonplaceholder.typicode.com
PASSIT_HTTPBIN_URL=https://httpbin.org
```

Override either variable in `.env.local` if you want to point the examples at
your own backend.

## Verify

```bash
npm run lint
npm run build
```
