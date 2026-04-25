import { describe, it, expect } from 'vitest'
import { mergeHeaders } from '@/utils/mergeHeaders'

describe('mergeHeaders', () => {
    it('merges client and passit headers', () => {
        const client = { 'x-user-id': '123' }
        const passit = { 'x-api-key': 'secret' }

        expect(mergeHeaders(client, passit)).toEqual({
            'x-user-id': '123',
            'x-api-key': 'secret',
        })
    })

    it('passit headers win on same key', () => {
        const client = { 'x-api-key': 'client-key' }
        const passit = { 'x-api-key': 'secret-key' }

        expect(mergeHeaders(client, passit)).toEqual({
            'x-api-key': 'secret-key',
        })
    })

    it('handles empty client headers', () => {
        const passit = { 'x-api-key': 'secret' }
        expect(mergeHeaders({}, passit)).toEqual({ 'x-api-key': 'secret' })
    })

    it('handles empty passit headers', () => {
        const client = { 'x-user-id': '123' }
        expect(mergeHeaders(client, {})).toEqual({ 'x-user-id': '123' })
    })

    it('handles both empty', () => {
        expect(mergeHeaders({}, {})).toEqual({})
    })
})
