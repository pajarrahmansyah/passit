import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
    forwardRequest: vi.fn(),
    fetchAdapter: vi.fn(),
    axiosAdapter: vi.fn(),
    runRequestHooks: vi.fn(),
    runResponseHooks: vi.fn(),
    runErrorHooks: vi.fn(),
}))

vi.mock('@/utils/forwardRequest', () => ({
    forwardRequest: mocks.forwardRequest,
}))

vi.mock('@/adapters/fetchAdapter', () => ({
    fetchAdapter: mocks.fetchAdapter,
}))

vi.mock('@/adapters/axiosAdapter', () => ({
    axiosAdapter: mocks.axiosAdapter,
}))

vi.mock('@/features/hooks', () => ({
    runRequestHooks: mocks.runRequestHooks,
    runResponseHooks: mocks.runResponseHooks,
    runErrorHooks: mocks.runErrorHooks,
}))

import { createPassIt, defineConfig } from '@/core/defineConfig'
import { passIt } from '@/core/passIt'

describe('passIt', () => {
    beforeEach(() => {
        vi.clearAllMocks()

        mocks.forwardRequest.mockResolvedValue({
            method: 'GET',
            headers: {},
            body: null,
            searchParams: '',
        })
    })

    it('builds the request and applies response transform after normalize', async () => {
        defineConfig({
            baseUrl: 'https://api.example.com',
            headers: {
                'x-api-key': 'server-key',
            },
            normalize: true,
        })

        mocks.forwardRequest.mockResolvedValue({
            method: 'GET',
            headers: {
                'x-api-key': 'client-key',
                'x-user-id': '123',
            },
            body: null,
            searchParams: 'page=1',
        })

        mocks.fetchAdapter.mockResolvedValue({
            status: 200,
            headers: {},
            data: { users: [] },
            ok: true,
        })

        const response = await passIt({
            path: '/users',
            req: {} as never,
            headers: {
                'x-trace-id': 'trace-1',
            },
            response: (data: unknown) => ({ wrapped: data }),
        })

        expect(mocks.fetchAdapter).toHaveBeenCalledWith(
            {
                url: 'https://api.example.com/users?page=1',
                method: 'GET',
                headers: {
                    // config header wins over client header
                    'x-api-key': 'server-key',
                    'x-user-id': '123',
                    'x-trace-id': 'trace-1',
                },
                body: null,
            },
            expect.objectContaining({
                baseUrl: 'https://api.example.com',
                http: 'fetch',
                timeout: 5000,
            }),
        )

        expect(await response.json()).toEqual({
            wrapped: {
                success: true,
                status: 200,
                data: { users: [] },
            },
        })
    })

    it('route-level headers override config headers on the same key', async () => {
        defineConfig({
            baseUrl: 'https://api.example.com',
            headers: {
                'x-api-key': 'config-key',
                'x-source': 'config',
            },
        })

        mocks.forwardRequest.mockResolvedValue({
            method: 'GET',
            headers: {},
            body: null,
            searchParams: '',
        })

        mocks.fetchAdapter.mockResolvedValue({
            status: 200,
            headers: {},
            data: {},
            ok: true,
        })

        await passIt({
            path: '/users',
            req: {} as never,
            headers: {
                'x-api-key': 'route-key',
            },
        })

        expect(mocks.fetchAdapter).toHaveBeenCalledWith(
            expect.objectContaining({
                headers: {
                    // route wins over config on conflict
                    'x-api-key': 'route-key',
                    // config-only header still present
                    'x-source': 'config',
                },
            }),
            expect.anything(),
        )
    })

    it('uses the axios adapter for axios-backed services', async () => {
        defineConfig({
            auth: {
                baseUrl: 'https://auth.example.com',
                http: 'axios',
            },
        })

        mocks.axiosAdapter.mockResolvedValue({
            status: 201,
            headers: {},
            data: { ok: true },
            ok: true,
        })

        const response = await passIt({
            service: 'auth',
            path: 'login',
        })

        expect(mocks.forwardRequest).not.toHaveBeenCalled()
        expect(mocks.axiosAdapter).toHaveBeenCalledWith(
            {
                url: 'https://auth.example.com/login',
                method: 'GET',
                headers: {},
                body: null,
            },
            expect.objectContaining({
                baseUrl: 'https://auth.example.com',
                http: 'axios',
            }),
        )
        expect(mocks.fetchAdapter).not.toHaveBeenCalled()
        expect(await response.json()).toEqual({ ok: true })
    })

    it('uses factory-bound config instead of the global config', async () => {
        const { passIt: boundPassIt } = createPassIt({
            baseUrl: 'https://bound.example.com',
        })

        defineConfig({
            baseUrl: 'https://global.example.com',
        })

        mocks.fetchAdapter.mockResolvedValue({
            status: 200,
            headers: {},
            data: { ok: true },
            ok: true,
        })

        await boundPassIt({
            path: '/users',
        })

        expect(mocks.fetchAdapter).toHaveBeenCalledWith(
            expect.objectContaining({
                url: 'https://bound.example.com/users',
            }),
            expect.objectContaining({
                baseUrl: 'https://bound.example.com',
            }),
        )
    })

    it('rejects when multiple services are configured without a service key', async () => {
        defineConfig({
            auth: {
                baseUrl: 'https://auth.example.com',
            },
            storage: {
                baseUrl: 'https://storage.example.com',
            },
        })

        await expect(
            passIt({
                path: '/users',
            }),
        ).rejects.toThrow(
            '[PassIt] Multiple services detected. Provide a "service" key in passIt() options.',
        )

        expect(mocks.fetchAdapter).not.toHaveBeenCalled()
        expect(mocks.axiosAdapter).not.toHaveBeenCalled()
    })

    it('runs request and response hooks on successful requests', async () => {
        const hooks = {
            onRequest: vi.fn(),
            onResponse: vi.fn(),
        }

        defineConfig({
            baseUrl: 'https://api.example.com',
            hooks,
        })

        mocks.forwardRequest.mockResolvedValue({
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: '{"name":"Ada"}',
            searchParams: '',
        })

        mocks.fetchAdapter.mockResolvedValue({
            status: 200,
            headers: {},
            data: { id: 1 },
            ok: true,
        })

        await passIt({
            path: '/users',
            req: {} as never,
        })

        expect(mocks.runRequestHooks).toHaveBeenCalledWith(
            hooks,
            {
                method: 'POST',
                path: '/users',
                headers: {
                    'content-type': 'application/json',
                },
            },
            false,
        )

        expect(mocks.runResponseHooks).toHaveBeenCalledWith(
            hooks,
            {
                status: 200,
                path: '/users',
                data: { id: 1 },
                duration: expect.any(Number),
            },
            false,
        )
    })

    it('returns a 500 response and runs error hooks when the adapter fails', async () => {
        const hooks = {
            onError: vi.fn(),
        }

        defineConfig({
            baseUrl: 'https://api.example.com',
            hooks,
        })

        mocks.forwardRequest.mockResolvedValue({
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: '{"name":"Ada"}',
            searchParams: '',
        })

        mocks.fetchAdapter.mockRejectedValue(new Error('backend down'))

        const response = await passIt({
            path: '/users',
            req: {} as never,
        })

        expect(mocks.runErrorHooks).toHaveBeenCalledWith(
            hooks,
            {
                status: 500,
                path: '/users',
                message: 'backend down',
            },
            false,
        )
        expect(mocks.runResponseHooks).not.toHaveBeenCalled()
        expect(response.status).toBe(500)
        expect(await response.json()).toEqual({
            success: false,
            status: 500,
            message: 'backend down',
        })
    })
})
