export function resolveTimeout(
    globalTimeout: number | false | undefined,
    routeTimeout: number | false | undefined,
): number | false {
    if (routeTimeout !== undefined) return routeTimeout
    if (globalTimeout !== undefined) return globalTimeout
    return 5000
}