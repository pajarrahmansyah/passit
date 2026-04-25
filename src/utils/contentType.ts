export type ContentTypeResult = 'json' | 'text' | 'html' | 'unknown'

export function detectContentType(headers: Headers): ContentTypeResult {
    const contentType = headers.get('content-type') ?? ''

    if (contentType.includes('application/json')) return 'json'
    if (contentType.includes('text/html')) return 'html'
    if (contentType.includes('text/plain')) return 'text'

    return 'unknown'
}

export async function parseResponseBody(response: Response): Promise<unknown> {
    const type = detectContentType(response.headers)

    switch (type) {
        case 'json':
            return response.json()
        case 'text':
            return response.text()
        case 'html':
            return null
        default:
            try {
                return await response.json()
            } catch {
                return null
            }
    }
}