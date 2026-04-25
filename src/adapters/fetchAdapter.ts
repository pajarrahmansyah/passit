import { parseResponseBody } from '@/utils/contentType'
import type { ResolvedConfig } from '@/core/types'

export interface AdapterRequest {
    url: string
    method: string
    headers: Record<string, string>
    body: string | null
}

export interface AdapterResponse {
    status: number
    headers: Record<string, string>
    data: unknown
    ok: boolean
}

export async function fetchAdapter(
    request: AdapterRequest,
    config: ResolvedConfig,
): Promise<AdapterResponse> {
    const controller = new AbortController()
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    if (config.timeout !== false) {
        timeoutId = setTimeout(() => {
            controller.abort()
        }, config.timeout)
    }

    try {
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body ?? undefined,
            signal: controller.signal,
        })

        const data = await parseResponseBody(response)

        const headers: Record<string, string> = {}
        response.headers.forEach((value, key) => {
            headers[key] = value
        })

        return {
            status: response.status,
            headers,
            data,
            ok: response.ok,
        }
    } finally {
        if (timeoutId) clearTimeout(timeoutId)
    }
}
