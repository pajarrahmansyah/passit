export function mergeHeaders(
    clientHeaders: Record<string, string> = {},
    passitHeaders: Record<string, string> = {},
): Record<string, string> {
    return {
        ...clientHeaders,
        ...passitHeaders,
    }
}