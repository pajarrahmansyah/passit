import type { HooksConfig, HookRequest, HookResponse, HookError } from '@/core/types'

type Environment = 'development' | 'production'

function getEnv(): Environment {
    return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

export function runRequestHooks(
    hooks: HooksConfig,
    req: HookRequest,
    override: boolean = false,
): void {
    const env = getEnv()
    const envHooks = env === 'production' ? hooks.prod : hooks.dev

    if (override && envHooks?.onRequest) {
        envHooks.onRequest(req)
        return
    }

    hooks.onRequest?.(req)
    envHooks?.onRequest?.(req)
}

export function runResponseHooks(
    hooks: HooksConfig,
    res: HookResponse,
    override: boolean = false,
): void {
    const env = getEnv()
    const envHooks = env === 'production' ? hooks.prod : hooks.dev

    if (override && envHooks?.onResponse) {
        envHooks.onResponse(res)
        return
    }

    hooks.onResponse?.(res)
    envHooks?.onResponse?.(res)
}

export function runErrorHooks(
    hooks: HooksConfig,
    err: HookError,
    override: boolean = false,
): void {
    const env = getEnv()
    const envHooks = env === 'production' ? hooks.prod : hooks.dev

    if (override && envHooks?.onError) {
        envHooks.onError(err)
        return
    }

    hooks.onError?.(err)
    envHooks?.onError?.(err)
}
