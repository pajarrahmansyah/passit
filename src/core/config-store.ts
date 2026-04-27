import type { PassItConfig, ServiceConfig } from '@/core/types'

let globalConfig: PassItConfig | null = null

export function setConfig(config: PassItConfig): void {
    globalConfig = config
}

export function getConfig(): PassItConfig | null {
    return globalConfig
}

export function isMultiService(
    config: PassItConfig,
): config is Record<string, ServiceConfig> {
    return !('baseUrl' in config)
}
