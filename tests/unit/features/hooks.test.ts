import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runRequestHooks, runResponseHooks, runErrorHooks } from '@/features/hooks'
import type { HooksConfig } from '@/core/types'

beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'development')
})

describe('runRequestHooks', () => {
    it('runs global onRequest hook', () => {
        const onRequest = vi.fn()
        const hooks: HooksConfig = { onRequest }

        runRequestHooks(hooks, { method: 'GET', path: '/users', headers: {} })
        expect(onRequest).toHaveBeenCalledTimes(1)
    })

    it('runs dev hook in development', () => {
        const devOnRequest = vi.fn()
        const hooks: HooksConfig = { dev: { onRequest: devOnRequest } }

        runRequestHooks(hooks, { method: 'GET', path: '/users', headers: {} })
        expect(devOnRequest).toHaveBeenCalledTimes(1)
    })

    it('runs both global and dev hooks together', () => {
        const globalOnRequest = vi.fn()
        const devOnRequest = vi.fn()
        const hooks: HooksConfig = {
            onRequest: globalOnRequest,
            dev: { onRequest: devOnRequest }
        }

        runRequestHooks(hooks, { method: 'GET', path: '/users', headers: {} })
        expect(globalOnRequest).toHaveBeenCalledTimes(1)
        expect(devOnRequest).toHaveBeenCalledTimes(1)
    })

    it('override replaces global with route hook', () => {
        const globalOnRequest = vi.fn()
        const routeOnRequest = vi.fn()
        const hooks: HooksConfig = {
            onRequest: globalOnRequest,
            dev: { onRequest: routeOnRequest }
        }

        runRequestHooks(hooks, { method: 'GET', path: '/users', headers: {} }, true)
        expect(globalOnRequest).not.toHaveBeenCalled()
        expect(routeOnRequest).toHaveBeenCalledTimes(1)
    })
})

describe('runResponseHooks', () => {
    it('runs global onResponse hook', () => {
        const onResponse = vi.fn()
        const hooks: HooksConfig = { onResponse }

        runResponseHooks(hooks, { status: 200, path: '/users', data: {}, duration: 32 })
        expect(onResponse).toHaveBeenCalledTimes(1)
    })
})

describe('runErrorHooks', () => {
    it('runs global onError hook', () => {
        const onError = vi.fn()
        const hooks: HooksConfig = { onError }

        runErrorHooks(hooks, { status: 500, path: '/users', message: 'error' })
        expect(onError).toHaveBeenCalledTimes(1)
    })
})
