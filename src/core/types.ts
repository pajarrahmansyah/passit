import type { NextRequest } from 'next/server'

// Basic HTTP types used across the library
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type HttpLib = 'fetch' | 'axios'

// Payloads passed into request/response/error hooks
export interface HookRequest {
    method: HttpMethod
    path: string
    headers: Record<string, string>
}

export interface HookResponse {
    status: number
    path: string
    data: unknown
    duration: number
}

export interface HookError {
    status: number
    path: string
    message: string
}

export interface HooksConfig {
    onRequest?: (req: HookRequest) => void
    onResponse?: (res: HookResponse) => void
    onError?: (err: HookError) => void
    dev?: {
        onRequest?: (req: HookRequest) => void
        onResponse?: (res: HookResponse) => void
        onError?: (err: HookError) => void
    }
    prod?: {
        onRequest?: (req: HookRequest) => void
        onResponse?: (res: HookResponse) => void
        onError?: (err: HookError) => void
    }
}

// Retry settings for upstream requests
export interface RetryConfig {
    times: number
    onStatus: number[]
}

// Options and result shapes for response normalization
export interface NormalizeConfig {
    success?: boolean
    error?: boolean
}

export interface NormalizedSuccess<T = unknown> {
    success: true
    status: number
    data: T
}

export interface NormalizedError {
    success: false
    status: number
    message: string
}

export type NormalizedResponse<T = unknown> =
    | NormalizedSuccess<T>
    | NormalizedError

// Config shared by a single service definition
export interface ServiceConfig {
    baseUrl: string
    http?: HttpLib
    headers?: Record<string, string>
    timeout?: number | false
    retry?: RetryConfig
    normalize?: boolean | NormalizeConfig
    hooks?: HooksConfig
}

// Top-level config can be one service or a map of services
export type PassItConfig =
    | ServiceConfig
    | Record<string, ServiceConfig>

// Per-route options passed into passIt()
//
// Two usage patterns are supported:
//
//   Config-backed  — `service` resolves baseUrl (and other defaults) from defineConfig.
//                    `baseUrl` is optional and overrides the configured value when set.
//
//   Direct         — no defineConfig involved; `baseUrl` is required at runtime.
//                    `service` is not needed (and is ignored for single-service configs).
//
// Both `service` and `baseUrl` are optional at the type level because TypeScript cannot
// know at compile time whether defineConfig was called with a single- or multi-service
// config. The runtime validates and throws a descriptive error when neither resolves.
export interface PassItOptions {
    service?: string
    baseUrl?: string
    path: string
    headers?: Record<string, string>
    timeout?: number | false
    retry?: RetryConfig
    normalize?: boolean | NormalizeConfig
    hooks?: HooksConfig & { override?: boolean }
    response?: (data: unknown) => unknown
    req?: NextRequest
}

// Internal config after global and route options are merged
export interface ResolvedConfig {
    baseUrl: string
    http: HttpLib
    headers: Record<string, string>
    timeout: number | false
    retry: RetryConfig | null
    normalize: NormalizeConfig | null
    hooks: HooksConfig | null
}
