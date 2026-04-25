import type { PassItConfig, ServiceConfig } from '@/core/types'

let globalConfig: PassItConfig | null = null

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

export function defineConfig(config: PassItConfig): PassItConfig {
    if (isServiceConfig(config)) {
        validateServiceConfig(config)
    } else {
        const services = config as Record<string, ServiceConfig>
        for (const [name, serviceConfig] of Object.entries(services)) {
            validateServiceConfig(serviceConfig, name)
        }
    }

    globalConfig = config
    return config
}

export function getConfig(): PassItConfig | null {
    return globalConfig
}

export function isMultiService(
    config: PassItConfig
): config is Record<string, ServiceConfig> {
    return !('baseUrl' in config)
}
