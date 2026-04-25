import type { NextRequest } from 'next/server'

export interface ForwardedRequest {
    method: string
    headers: Record<string, string>
    body: string | null
    searchParams: string
}

export function forwardRequest(req: NextRequest): ForwardedRequest {
    const method = req.method

    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
        const skipped = ['host', 'connection', 'content-length']
        if (!skipped.includes(key)) {
            headers[key] = value
        }
    })

    const searchParams = req.nextUrl.searchParams.toString()

    const hasBody = !['GET', 'HEAD'].includes(method)
    const body = hasBody ? JSON.stringify(req.body) : null

    return {
        method,
        headers,
        body,
        searchParams,
    }
}