import type { PassItConfig, ServiceConfig } from '@/core/types'

const CONFIG_KEY = '__PASSIT_CONFIG__'

type PassItGlobal = typeof globalThis & {
    [CONFIG_KEY]?: PassItConfig | null
}

function getStore(): PassItGlobal {
    return globalThis as PassItGlobal
}

export function setConfig(config: PassItConfig): void {
    getStore()[CONFIG_KEY] = config
}

export function getConfig(): PassItConfig | null {
    return getStore()[CONFIG_KEY] ?? null
}

export function isMultiService(
    config: PassItConfig,
): config is Record<string, ServiceConfig> {
    return !('baseUrl' in config)
}
