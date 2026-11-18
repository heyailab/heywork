/**
 * Match the interruption categories whose action opens the original UMA request.
 * @param code - durable failure code.
 * @returns whether the failure is an interrupted UMA request.
 */
export function isUmaRequestInterruption(code: unknown): boolean {
  return code === 'UMA_REQUEST_INTERRUPTED' || code === 'UMA_REQUEST_INTERRUPTED_CHARGED'
    || code === 'UMA_REQUEST_INTERRUPTED_UNCHARGED'
}
