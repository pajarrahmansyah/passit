import type { NextRequest } from 'next/server'
import { getConfig, isMultiService } from '@/core/defineConfig'
import type {
    PassItOptions,
    ResolvedConfig,
    ServiceConfig,
    HooksConfig,
} from '@/core/types'
import { mergeHeaders } from '@/utils/mergeHeaders'
import { forwardRequest } from '@/utils/forwardRequest'
import { fetchAdapter } from '@/adapters/fetchAdapter'
import { axiosAdapter } from '@/adapters/axiosAdapter'
import { resolveTimeout } from '@/features/timeout'
import { withRetry } from '@/features/retry'
import { normalizeResponse, resolveNormalizeConfig } from '@/features/normalize'
import { runRequestHooks, runResponseHooks, runErrorHooks } from '@/features/hooks'

function resolveServiceConfig(options: PassItOptions): ServiceConfig {
    const config = getConfig()

    if (!config) {
        throw new Error(
            '[PassIt] Config not found. Did you forget to import your passit.config.ts?\n\nSee setup guide: https://github.com/pajarrahmansyah/passit#getting-started'
        )
    }

    if (isMultiService(config)) {
        if (!options.service) {
            throw new Error(
                '[PassIt] Multiple services detected. Provide a "service" key in passIt() options.'
            )
        }

        const serviceConfig = config[options.service]

        if (!serviceConfig) {
            throw new Error(
                `[PassIt] Service "${options.service}" not found in defineConfig.`
            )
        }

        return serviceConfig
    }

    return config
}

function buildResolvedConfig(
    serviceConfig: ServiceConfig,
    options: PassItOptions,
): ResolvedConfig {
    return {
        baseUrl: options.baseUrl ?? serviceConfig.baseUrl,
        http: serviceConfig.http ?? 'fetch',
        headers: mergeHeaders(
            options.headers ?? {},
            serviceConfig.headers ?? {},
        ),
        timeout: resolveTimeout(serviceConfig.timeout, options.timeout),
        retry: options.retry ?? serviceConfig.retry ?? null,
        normalize: resolveNormalizeConfig(
            options.normalize ?? serviceConfig.normalize
        ),
        hooks: options.hooks ?? serviceConfig.hooks ?? null,
    }
}

function buildUrl(baseUrl: string, path: string, searchParams: string): string {
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const query = searchParams ? `?${searchParams}` : ''
    return `${base}${normalizedPath}${query}`
}

function mergeHooks(
    resolvedHooks: HooksConfig | null,
    optionHooks: (HooksConfig & { override?: boolean }) | undefined,
): { hooks: HooksConfig | null; override: boolean } {
    if (!optionHooks) return { hooks: resolvedHooks, override: false }

    const { override = false, ...routeHooks } = optionHooks

    if (override) return { hooks: routeHooks, override: true }

    return {
        hooks: {
            ...resolvedHooks,
            ...routeHooks,
        },
        override: false,
    }
}

export async function passIt(options: PassItOptions): Promise<Response> {
    const serviceConfig = resolveServiceConfig(options)
    const resolved = buildResolvedConfig(serviceConfig, options)

    const forwarded = options.req
        ? forwardRequest(options.req as NextRequest)
        : { method: 'GET', headers: {}, body: null, searchParams: '' }

    const finalHeaders = mergeHeaders(forwarded.headers, resolved.headers)
    const url = buildUrl(resolved.baseUrl, options.path, forwarded.searchParams)

    const adapterRequest = {
        url,
        method: forwarded.method,
        headers: finalHeaders,
        body: forwarded.body,
    }

    const { hooks, override } = mergeHooks(resolved.hooks, options.hooks)

    if (hooks) {
        runRequestHooks(hooks, {
            method: forwarded.method as import('./types').HttpMethod,
            path: options.path,
            headers: finalHeaders,
        }, override)
    }

    const adapterFn = resolved.http === 'axios' ? axiosAdapter : fetchAdapter
    const startTime = Date.now()

    try {
        const response = resolved.retry
            ? await withRetry(adapterFn, adapterRequest, resolved, resolved.retry)
            : await adapterFn(adapterRequest, resolved)

        const duration = Date.now() - startTime

        if (hooks) {
            runResponseHooks(hooks, {
                status: response.status,
                path: options.path,
                data: response.data,
                duration,
            }, override)
        }

        let finalData = response.data

        if (resolved.normalize) {
            finalData = normalizeResponse(finalData, response.status, resolved.normalize)
        }

        if (options.response) {
            finalData = options.response(finalData)
        }

        return Response.json(finalData, { status: response.status })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred'
        const status = 500

        if (hooks) {
            runErrorHooks(hooks, {
                status,
                path: options.path,
                message,
            }, override)
        }

        return Response.json(
            { success: false, status, message },
            { status }
        )
    }
}
