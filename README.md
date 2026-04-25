# PassIt 

> Stop rewriting proxy boilerplate. Never again.

PassIt is a config-driven proxy gateway for Next.js App Router Route Handlers. It sits between your client and your real backend. Handling auth headers, retries, timeouts, error normalization, and logging. So, you don't have to.

```
Client → Route Handler (PassIt) → Real Backend
```

## Why PassIt?

Every Next.js project that talks to a separate backend ends up writing the same boilerplate:

```ts
export async function GET(req: NextRequest) {
  const res = await fetch(`${process.env.BACKEND_URL}/users?${req.nextUrl.searchParams}`, {
    headers: { 'x-api-key': process.env.API_KEY },
  })
  return Response.json(await res.json())
}
```

Repeated. Every route. Forever.

With PassIt:

```ts
export async function GET(req: NextRequest) {
  return passIt({ path: '/users', req })
}
```

Config lives in one place. Secrets stay server-side. Routes stay clean.

---

## What PassIt Does and Doesn't Do

### ✅ What PassIt handles
- Proxying client requests to your real backend securely
- Keeping API keys and backend URLs server-side only
- Auto forwarding query params, request body, and dynamic headers
- Merging headers — PassIt headers always win on same key conflict
- Timeout handling with per route override
- Retry logic on server errors only (5xx), never on success or client errors (4xx)
- Response normalization into consistent success/error shape
- Content-Type detection — handles JSON, plain text, and HTML responses gracefully
- Logging hooks with dev/prod environment separation
- fetch and axios support via adapter pattern

### ❌ What PassIt does NOT handle
- Client side data fetching — use axios, SWR, or React Query for that
- CORS — configure that in Next.js or your hosting layer
- Infrastructure concerns — rate limiting, SSL, load balancing belong at the infra level
- Pages Router — Next.js App Router only for now
- Framework agnostic support — Next.js only in v1

### 🔒 Security model

PassIt runs server side only inside Next.js Route Handlers. Your API keys, backend URLs, and auth tokens never reach the client.

```
Client (browser)          Your Next.js Server
─────────────────         ──────────────────────────────
knows about:              knows about:
/api/users        →       https://real-backend-api.com/users
                          x-api-key: secret
                          all PassIt logic
```

---

## Getting Started

### Step 1 — Install

```bash
npm install @pajarrahmansyah/passit
```

For axios support (optional):

```bash
npm install axios
```

### Step 2 — Create your config

Create `passit.config.ts` at your project root:

**Single service:**

```ts
import { defineConfig } from '@pajarrahmansyah/passit'

export default defineConfig({
  baseUrl: 'https://api.backend.com',
  headers: {
    'x-api-key': process.env.API_KEY,
  },
})
```

**Multiple services:**

```ts
import { defineConfig } from '@pajarrahmansyah/passit'

export default defineConfig({
  auth: {
    baseUrl: 'https://auth.backend.com',
    headers: { 'x-api-key': process.env.AUTH_KEY },
  },
  storage: {
    baseUrl: 'https://storage.backend.com',
    headers: { 'x-api-key': process.env.STORAGE_KEY },
  },
})
```

### Step 3 — Load your config

Choose ONE of these options:

**Option 1 — instrumentation.ts (Recommended, Next.js 15+)**

Create `instrumentation.ts` at your project root:

```ts
export async function register() {
  await import('./passit.config')
}
```

**Option 2 — instrumentation.ts (Next.js 14)**

Add experimental flag to `next.config.ts` first:

```ts
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
}
export default nextConfig
```

Then create `instrumentation.ts`:

```ts
export async function register() {
  await import('./passit.config')
}
```

**Option 3 — Root layout import**

Add one line to your `app/layout.tsx`:

```ts
import '@/passit.config'
```

**Option 4 — Next.js plugin**

```ts
import { withPassIt } from '@pajarrahmansyah/passit/next'

export default withPassIt({
  // your next.js config
})
```

### Step 4 — Use in your routes

```ts
import { passIt } from '@pajarrahmansyah/passit'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  return passIt({ path: '/users', req })
}
```

That's it. PassIt forwards the request, injects your headers, and returns the response. 🔥

---

## Usage Examples

### Basic proxy

```ts
export async function GET(req: NextRequest) {
  return passIt({ path: '/users', req })
}
```

### With service key (multi service config)

```ts
export async function GET(req: NextRequest) {
  return passIt({ service: 'auth', path: '/login', req })
}
```

### With per route overrides

```ts
export async function GET(req: NextRequest) {
  return passIt({
    path: '/heavy-report',
    req,
    timeout: false,
    retry: { times: 1, onStatus: [500] },
  })
}
```

### With custom response transformer

```ts
export async function GET(req: NextRequest) {
  return passIt({
    path: '/users',
    req,
    response: (data) => ({
      users: data.results,
      total: data.count,
    }),
  })
}
```

### With hooks for logging

```ts
export default defineConfig({
  baseUrl: 'https://api.backend.com',
  hooks: {
    dev: {
      onRequest: (req) => console.log(`--> ${req.method} ${req.path}`),
      onResponse: (res) => console.log(`<-- ${res.status} ${res.path} ${res.duration}ms`),
      onError: (err) => console.error(`[error] ${err.message}`),
    },
    prod: {
      onError: (err) => Sentry.captureException(err),
    },
  },
})
```

---

## Config Reference

### defineConfig options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `baseUrl` | `string` | ✅ | — | Real backend base URL, no trailing slash |
| `http` | `fetch \| axios` | ❌ | `fetch` | HTTP library |
| `headers` | `Record<string, string>` | ❌ | `{}` | Static headers injected on every request |
| `timeout` | `number \| false` | ❌ | `5000` | Timeout in ms, `false` to disable |
| `retry` | `RetryConfig` | ❌ | — | Retry on failure |
| `normalize` | `boolean \| NormalizeConfig` | ❌ | — | Normalize response shape |
| `hooks` | `HooksConfig` | ❌ | — | Logging and observability |

### passIt options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `path` | `string` | ✅ | Backend endpoint path |
| `req` | `NextRequest` | ✅ | Next.js request object |
| `service` | `string` | ❌ | Service key for multi service config |
| `baseUrl` | `string` | ❌ | Overrides global baseUrl |
| `headers` | `Record<string, string>` | ❌ | Extra headers for this route |
| `timeout` | `number \| false` | ❌ | Overrides global timeout |
| `retry` | `RetryConfig` | ❌ | Overrides global retry |
| `normalize` | `boolean \| NormalizeConfig` | ❌ | Overrides global normalize |
| `hooks` | `HooksConfig & { override?: boolean }` | ❌ | Route level hooks |
| `response` | `(data: unknown) => unknown` | ❌ | Custom response transformer. Runs AFTER normalize if both are defined. Disable normalize on that route if you need raw data. |

> **Note:** If both `normalize` and `response` are defined, `response` receives already normalized data. To access raw backend data inside `response`, set `normalize: false` on that route.

### RetryConfig

| Option | Type | Description |
|--------|------|-------------|
| `times` | `number` | Max retry attempts |
| `onStatus` | `number[]` | Status codes that trigger retry e.g. `[500, 502, 503]` |

### NormalizeConfig

| Option | Type | Description |
|--------|------|-------------|
| `success` | `boolean` | Normalize success responses |
| `error` | `boolean` | Normalize error responses |

**Normalized shapes:**

```ts
// success
{ success: true, status: 200, data: { ...response } }

// error
{ success: false, status: 404, message: 'not found' }
```

### HooksConfig

| Option | Type | Description |
|--------|------|-------------|
| `onRequest` | `(req: HookRequest) => void` | Runs before every request |
| `onResponse` | `(res: HookResponse) => void` | Runs after every response |
| `onError` | `(err: HookError) => void` | Runs on every error |
| `dev` | `HookHandlers` | Runs in development only |
| `prod` | `HookHandlers` | Runs in production only |

---

## Requirements

- Next.js `>= 14.0.0`
- Node.js `>= 18.0.0`
- axios `>= 1.0.0` (optional)

---

## Roadmap

- v1 — Next.js App Router, full feature set
- v2 — Staging environment hooks, Pages Router support
- v3 — Framework agnostic

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

---

## License

MIT © [Pajar Rahmansyah](https://github.com/pajarrahmansyah)