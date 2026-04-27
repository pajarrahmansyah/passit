import type { NextConfig } from 'next'
import path from 'node:path'

export function withPassIt(nextConfig: NextConfig = {}): NextConfig {
    return {
        ...nextConfig,
        experimental: {
            ...nextConfig.experimental,
            // instrumentationHook was experimental in Next.js 14; built-in from 15+.
            // Cast keeps the flag effective on 14 while Next.js 15/16 ignores it.
            instrumentationHook: true,
        } as NextConfig['experimental'],
    }
}

/**
 * Drop-in `register` export for `instrumentation.ts`.
 * Automatically imports `passit.config` from your project root at server startup.
 */
export async function register(): Promise<void> {
    await import(/* webpackIgnore: true */ path.join(process.cwd(), 'passit.config'))
}
