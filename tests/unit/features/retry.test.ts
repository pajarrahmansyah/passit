import { describe, it, expect, vi } from 'vitest'
import { withRetry } from '@/features/retry'
import type { AdapterRequest, AdapterResponse } from '@/adapters/fetchAdapter'
import type { ResolvedConfig } from '@/core/types'

const mockRequest: AdapterRequest = {
    url: 'https://api.example.com/users',
    method: 'GET',
    headers: {},
    body: null,
}

const mockConfig: ResolvedConfig = {
    baseUrl: 'https://api.example.com',
    http: 'fetch',
    headers: {},
    timeout: 5000,
    retry: null,
    normalize: null,
    hooks: null,
}

describe('withRetry', () => {
    it('returns response immediately on success', async () => {
        const adapter = vi.fn().mockResolvedValue({
            status: 200,
            headers: {},
            data: { users: [] },
            ok: true,
        } as AdapterResponse)

        const result = await withRetry(
            adapter,
            mockRequest,
            mockConfig,
            { times: 3, onStatus: [500] }
        )

        expect(adapter).toHaveBeenCalledTimes(1)
        expect(result.status).toBe(200)
    })

    it('retries on configured status code', async () => {
        const adapter = vi.fn()
            .mockResolvedValueOnce({ status: 500, headers: {}, data: null, ok: false })
            .mockResolvedValueOnce({ status: 500, headers: {}, data: null, ok: false })
            .mockResolvedValueOnce({ status: 200, headers: {}, data: { ok: true }, ok: true })

        const result = await withRetry(
            adapter,
            mockRequest,
            mockConfig,
            { times: 3, onStatus: [500] }
        )

        expect(adapter).toHaveBeenCalledTimes(3)
        expect(result.status).toBe(200)
    })

    it('does not retry on non configured status code', async () => {
        const adapter = vi.fn().mockResolvedValue({
            status: 404,
            headers: {},
            data: null,
            ok: false,
        } as AdapterResponse)

        const result = await withRetry(
            adapter,
            mockRequest,
            mockConfig,
            { times: 3, onStatus: [500] }
        )

        expect(adapter).toHaveBeenCalledTimes(1)
        expect(result.status).toBe(404)
    })

    it('stops retrying after max attempts', async () => {
        vi.useFakeTimers()

        const adapter = vi.fn().mockResolvedValue({
            status: 500,
            headers: {},
            data: null,
            ok: false,
        } as AdapterResponse)

        const promise = withRetry(
            adapter,
            mockRequest,
            mockConfig,
            { times: 3, onStatus: [500] }
        )

        await vi.runAllTimersAsync()
        const result = await promise

        expect(adapter).toHaveBeenCalledTimes(4) // 1 initial + 3 retries
        expect(result.status).toBe(500)

        vi.useRealTimers()
    }, 10000)
})
