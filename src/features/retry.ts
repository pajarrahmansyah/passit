import type { RetryConfig } from '@/core/types'
import type { AdapterRequest, AdapterResponse } from '@/adapters/fetchAdapter'
import type { ResolvedConfig } from '@/core/types'

type AdapterFn = (
    request: AdapterRequest,
    config: ResolvedConfig,
) => Promise<AdapterResponse>

export async function withRetry(
    adapterFn: AdapterFn,
    request: AdapterRequest,
    config: ResolvedConfig,
    retryConfig: RetryConfig,
): Promise<AdapterResponse> {
    let attempts = 0

    while (true) {
        try {
            const response = await adapterFn(request, config)

            const shouldRetry =
                attempts < retryConfig.times &&
                retryConfig.onStatus.includes(response.status)

            if (!shouldRetry) return response

            attempts++
            await backoff(attempts)
        } catch (err) {
            if (attempts >= retryConfig.times) throw err
            attempts++
            await backoff(attempts)
        }
    }
}

function backoff(attempt: number): Promise<void> {
    return new Promise((resolve) =>
        setTimeout(resolve, 1000 * attempt)
    )
}
