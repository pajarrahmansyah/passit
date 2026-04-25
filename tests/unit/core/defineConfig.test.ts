import { describe, it, expect, beforeEach } from 'vitest'
import { defineConfig, getConfig } from '@/core/defineConfig'

beforeEach(() => {
    // reset global config between tests
    defineConfig({ baseUrl: 'https://api.example.com' })
})

describe('defineConfig', () => {
    it('stores single service config', () => {
        defineConfig({ baseUrl: 'https://api.example.com' })
        expect(getConfig()).toMatchObject({ baseUrl: 'https://api.example.com' })
    })

    it('stores multi service config', () => {
        defineConfig({
            auth: { baseUrl: 'https://auth.example.com' },
            storage: { baseUrl: 'https://storage.example.com' },
        })
        expect(getConfig()).toMatchObject({
            auth: { baseUrl: 'https://auth.example.com' },
            storage: { baseUrl: 'https://storage.example.com' },
        })
    })

    it('throws when baseUrl is missing', () => {
        expect(() =>
            defineConfig({ baseUrl: '' })
        ).toThrow('[PassIt] baseUrl is required')
    })

    it('throws when baseUrl has trailing slash', () => {
        expect(() =>
            defineConfig({ baseUrl: 'https://api.example.com/' })
        ).toThrow('[PassIt] baseUrl should not have a trailing slash')
    })

    it('throws when timeout is invalid', () => {
        expect(() =>
            defineConfig({ baseUrl: 'https://api.example.com', timeout: -1 })
        ).toThrow('[PassIt] timeout must be a positive number or false')
    })

    it('throws when retry.times is zero', () => {
        expect(() =>
            defineConfig({
                baseUrl: 'https://api.example.com',
                retry: { times: 0, onStatus: [500] }
            })
        ).toThrow('[PassIt] retry.times must be greater than 0')
    })

    it('throws when retry.onStatus is empty', () => {
        expect(() =>
            defineConfig({
                baseUrl: 'https://api.example.com',
                retry: { times: 3, onStatus: [] }
            })
        ).toThrow('[PassIt] retry.onStatus must have at least one status code')
    })
})
