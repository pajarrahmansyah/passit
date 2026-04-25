import { describe, it, expect } from 'vitest'
import { resolveTimeout } from '@/features/timeout'

describe('resolveTimeout', () => {
    it('returns default 5000 when nothing defined', () => {
        expect(resolveTimeout(undefined, undefined)).toBe(5000)
    })

    it('returns global timeout when no route timeout', () => {
        expect(resolveTimeout(10000, undefined)).toBe(10000)
    })

    it('route timeout overrides global', () => {
        expect(resolveTimeout(10000, 3000)).toBe(3000)
    })

    it('route false disables timeout', () => {
        expect(resolveTimeout(10000, false)).toBe(false)
    })

    it('global false disables timeout', () => {
        expect(resolveTimeout(false, undefined)).toBe(false)
    })
})
