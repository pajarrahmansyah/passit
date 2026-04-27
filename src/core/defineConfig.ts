import type {
    PassItConfig,
    PassItOptionsSingle,
    PassItOptionsMulti,
    ServiceConfig,
} from '@/core/types'
import { setConfig } from '@/core/config-store'
import { passItWithConfig } from '@/core/passIt'

function isServiceConfig(config: PassItConfig): config is ServiceConfig {
    return 'baseUrl' in config
}

function validateServiceConfig(config: ServiceConfig, name?: string): void {
    const label = name ? `[PassIt:${name}]` : '[PassIt]'

    if (!config.baseUrl) {
        throw new Error(`${label} baseUrl is required`)
    }

    if (config.baseUrl.endsWith('/')) {
        throw new Error(`${label} baseUrl should not have a trailing slash`)
    }

    if (config.timeout !== false && config.timeout !== undefined) {
        if (typeof config.timeout !== 'number' || config.timeout <= 0) {
            throw new Error(`${label} timeout must be a positive number or false`)
        }
    }

    if (config.retry) {
        if (config.retry.times <= 0) {
            throw new Error(`${label} retry.times must be greater than 0`)
        }
        if (!config.retry.onStatus?.length) {
            throw new Error(`${label} retry.onStatus must have at least one status code`)
        }
    }
}

type PassItFn<TOptions> = (options: TOptions) => Promise<Response>

export function createPassIt(
    config: ServiceConfig,
): { passIt: PassItFn<PassItOptionsSingle> }

export function createPassIt<T extends Record<string, ServiceConfig>>(
    config: T,
): { passIt: PassItFn<PassItOptionsMulti<keyof T & string>> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createPassIt(config: PassItConfig): { passIt: PassItFn<any> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createPassIt(config: PassItConfig): { passIt: PassItFn<any> } {
    if (isServiceConfig(config)) {
        validateServiceConfig(config)
    } else {
        for (const [name, serviceConfig] of Object.entries(
            config as Record<string, ServiceConfig>,
        )) {
            validateServiceConfig(serviceConfig, name)
        }
    }

    return {
        passIt: (options) => passItWithConfig(options, config),
    }
}

export function defineConfig(
    config: ServiceConfig,
): { passIt: PassItFn<PassItOptionsSingle> }

export function defineConfig<T extends Record<string, ServiceConfig>>(
    config: T,
): { passIt: PassItFn<PassItOptionsMulti<keyof T & string>> }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defineConfig(config: PassItConfig): { passIt: PassItFn<any> } {
    const passItConfig = createPassIt(config)

    setConfig(config)

    return passItConfig
}
