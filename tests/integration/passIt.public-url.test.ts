import { beforeEach, describe, expect, it } from 'vitest'

import { defineConfig } from '@/core/defineConfig'
import { passIt } from '@/core/passIt'

const describeLive = process.env.PASSIT_RUN_LIVE_TESTS === 'true'
    ? describe
    : describe.skip

describeLive('passIt live integration', () => {
    beforeEach(() => {
        defineConfig({
            baseUrl: 'https://jsonplaceholder.typicode.com',
            timeout: 10000,
            normalize: true,
        })
    })

    it('proxies a real request to a public API', async () => {
        const response = await passIt({
            path: '/posts/1',
        } as never)

        expect(response.status).toBe(200)

        const body = await response.json() as {
            success: true
            status: number
            data: {
                userId: number
                id: number
                title: string
                body: string
            }
        }

        expect(body).toMatchObject({
            success: true,
            status: 200,
            data: {
                userId: 1,
                id: 1,
            },
        })
        expect(body.data.title).toEqual(expect.any(String))
        expect(body.data.body).toEqual(expect.any(String))
    }, 20000)
})
