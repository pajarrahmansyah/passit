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

// Base per-route options — no service routing concern here.
// Use PassItOptionsSingle or PassItOptionsMulti<T> (returned by defineConfig)
// for config-backed routes with compile-time service key enforcement.
export interface PassItOptions {
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

// Typed passIt options returned by defineConfig — enforced at compile time
//
//   PassItOptionsSingle   — single-service config; `service` is not applicable
//   PassItOptionsMulti<T> — multi-service config; `service` is required and
//                           constrained to the exact keys registered in defineConfig
export type PassItOptionsSingle = PassItOptions & {
    service?: never
}

export type PassItOptionsMulti<TService extends string> = PassItOptions & {
    service: TService
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
