import { defineConfig, type ServiceConfig } from "@pajarrahmansyah/passit";

const jsonPlaceholderUrl =
  process.env.PASSIT_JSONPLACEHOLDER_URL ?? "https://jsonplaceholder.typicode.com";

const httpBinUrl = process.env.PASSIT_HTTPBIN_URL ?? "https://httpbin.org";

export default defineConfig({
  json: {
    baseUrl: jsonPlaceholderUrl,
    http: "fetch",
    headers: {
      "x-passit-app": "nextjs-15-example",
      "x-passit-service": "jsonplaceholder",
    },
    timeout: 5000,
    normalize: {
      success: true,
      error: true,
    },
    hooks: {
      dev: {
        onRequest: (req) => console.log(`[passit] --> ${req.method} ${req.path}`),
        onResponse: (res) =>
          console.log(`[passit] <-- ${res.status} ${res.path} ${res.duration}ms`),
        onError: (err) => console.error(`[passit] xx ${err.path}: ${err.message}`),
      },
    },
  },
  httpbin: {
    baseUrl: httpBinUrl,
    http: "fetch",
    headers: {
      "x-passit-app": "nextjs-15-example",
      "x-passit-service": "httpbin",
    },
    timeout: 4000,
    normalize: false,
  },
  axiosJson: {
    baseUrl: jsonPlaceholderUrl,
    http: "axios",
    headers: {
      "x-passit-app": "nextjs-15-example",
      "x-passit-service": "axios-jsonplaceholder",
    },
    timeout: 5000,
    normalize: true,
  },
} satisfies Record<string, ServiceConfig>);
