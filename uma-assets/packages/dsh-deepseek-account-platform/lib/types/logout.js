/** Bounded revocation attempts for a grant owned by the durable logout journal. */
import { setTimeout } from 'node:timers/promises';
import { logoutAccount } from "./protocol.js";
function cancelled(signal) { return signal.aborted; }
/**
 * Revoke one captured grant without changing local account state.
 * @param origin - Issuer verified before local grant removal.
 * @param token - Removed grant, never replaced with a later login's token.
 * @param policy - Request deadline and exponential retry limits.
 * @param signal - Provider lifetime; shutdown aborts requests and delays.
 * @param headers - Validated issuer-only deployment headers.
 * @returns Whether the captured credential was revoked, remained unconfirmed, or was interrupted.
 */
export async function revokeAccount(origin, token, policy, signal, headers) {
    for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
        if (cancelled(signal))
            return 'cancelled';
        if (attempt > 0) {
            try {
                await setTimeout(policy.delayMs * 2 ** (attempt - 1), undefined, { signal, ref: false });
            }
            catch {
                return 'cancelled';
            } // The validated delay rejects only when the provider lifetime ends.
        }
        try {
            await logoutAccount(origin, token, AbortSignal.any([signal, AbortSignal.timeout(policy.requestTimeoutMs)]), headers);
            return 'confirmed';
        }
        catch (_error) {
            if (cancelled(signal))
                return 'cancelled';
            // Other remote failures consume one attempt without restoring credentials.
        }
    }
    return 'failed';
}
//# sourceMappingURL=logout.js.map