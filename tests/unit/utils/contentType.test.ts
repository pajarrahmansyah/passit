import { describe, it, expect } from 'vitest'
import { detectContentType } from '@/utils/contentType'

describe('detectContentType', () => {
    it('detects json', () => {
        const headers = new Headers({ 'content-type': 'application/json' })
        expect(detectContentType(headers)).toBe('json')
    })

    it('detects html', () => {
        const headers = new Headers({ 'content-type': 'text/html' })
        expect(detectContentType(headers)).toBe('html')
    })

    it('detects plain text', () => {
        const headers = new Headers({ 'content-type': 'text/plain' })
        expect(detectContentType(headers)).toBe('text')
    })

    it('returns unknown for unrecognized content type', () => {
        const headers = new Headers({ 'content-type': 'application/xml' })
        expect(detectContentType(headers)).toBe('unknown')
    })

    it('returns unknown when no content type', () => {
        const headers = new Headers()
        expect(detectContentType(headers)).toBe('unknown')
    })
})
