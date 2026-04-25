import type { ResolvedConfig } from '@/core/types'
import type { AdapterRequest, AdapterResponse } from '@/adapters/fetchAdapter'

export async function axiosAdapter(
    request: AdapterRequest,
    config: ResolvedConfig,
): Promise<AdapterResponse> {
    let axios: typeof import('axios').default

    try {
        const module = await import('axios')
        axios = module.default
    } catch {
        throw new Error(
            '[PassIt] axios is not installed. Run: npm install axios'
        )
    }

    try {
        const response = await axios({
            url: request.url,
            method: request.method,
            headers: request.headers,
            data: request.body ?? undefined,
            timeout: config.timeout === false ? 0 : config.timeout,
            validateStatus: () => true,
        })

        const headers: Record<string, string> = {}
        for (const [key, value] of Object.entries(response.headers)) {
            if (typeof value === 'string') {
                headers[key] = value
            }
        }

        return {
            status: response.status,
            headers,
            data: response.data,
            ok: response.status >= 200 && response.status < 300,
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw new Error(`[PassIt] axios request failed: ${err.message}`)
        }
        throw err
    }
}
