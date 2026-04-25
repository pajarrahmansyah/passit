import { describe, it, expect } from 'vitest'
import { normalizeResponse, resolveNormalizeConfig } from '@/features/normalize'

describe('normalizeResponse', () => {
    it('normalizes error with message field', () => {
        const result = normalizeResponse(
            { message: 'not found' },
            404,
            { error: true }
        )
        expect(result).toEqual({
            success: false,
            status: 404,
            message: 'not found',
        })
    })

    it('normalizes error with error field', () => {
        const result = normalizeResponse(
            { error: 'unauthorized' },
            401,
            { error: true }
        )
        expect(result).toEqual({
            success: false,
            status: 401,
            message: 'unauthorized',
        })
    })

    it('uses fallback message for unrecognized error shape', () => {
        const result = normalizeResponse(
            { oops: 'something broke' },
            500,
            { error: true }
        )
        expect(result).toEqual({
            success: false,
            status: 500,
            message: 'An unexpected error occurred',
        })
    })

    it('normalizes success response', () => {
        const result = normalizeResponse(
            { users: [] },
            200,
            { success: true }
        )
        expect(result).toEqual({
            success: true,
            status: 200,
            data: { users: [] },
        })
    })

    it('returns raw data when normalize is disabled', () => {
        const data = { users: [] }
        const result = normalizeResponse(data, 200, { success: false })
        expect(result).toEqual(data)
    })
})

describe('resolveNormalizeConfig', () => {
    it('returns null when normalize is false', () => {
        expect(resolveNormalizeConfig(false)).toBeNull()
    })

    it('returns null when normalize is undefined', () => {
        expect(resolveNormalizeConfig(undefined)).toBeNull()
    })

    it('returns full config when normalize is true', () => {
        expect(resolveNormalizeConfig(true)).toEqual({
            success: true,
            error: true,
        })
    })

    it('returns config as is when object provided', () => {
        expect(resolveNormalizeConfig({ success: true, error: false })).toEqual({
            success: true,
            error: false,
        })
    })
})
