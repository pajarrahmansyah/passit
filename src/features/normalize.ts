import type { NormalizeConfig, NormalizedResponse } from '@/core/types'

const ERROR_FIELDS = ['message', 'error', 'errors', 'detail', 'msg'] as const

function extractErrorMessage(data: unknown): string {
    if (!data || typeof data !== 'object') return 'An unexpected error occurred'

    const obj = data as Record<string, unknown>

    for (const field of ERROR_FIELDS) {
        if (typeof obj[field] === 'string') return obj[field] as string
        if (Array.isArray(obj[field]) && typeof obj[field][0]?.detail === 'string') {
            return obj[field][0].detail
        }
    }

    return 'An unexpected error occurred'
}

export function normalizeResponse(
    data: unknown,
    status: number,
    config: NormalizeConfig,
): NormalizedResponse {
    const isError = status >= 400

    if (isError && config.error !== false) {
        return {
            success: false,
            status,
            message: extractErrorMessage(data),
        }
    }

    if (!isError && config.success !== false) {
        return {
            success: true,
            status,
            data,
        }
    }

    return data as NormalizedResponse
}

export function resolveNormalizeConfig(
    normalize: boolean | NormalizeConfig | undefined,
): NormalizeConfig | null {
    if (!normalize) return null
    if (normalize === true) return { success: true, error: true }
    return normalize
}
