import type { NextConfig } from 'next'

export function withPassIt(nextConfig: NextConfig = {}): NextConfig {
    return {
        ...nextConfig,
    }
}