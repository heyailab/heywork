/** Browser tab ownership for one UI-initiated authorization attempt. */
import type { AccountView, SignInAttemptId } from '@deepseek-ai/dsh-deepseek-account/types'

interface Handoff {
  popup: Window | null
  navigated: boolean
  attempt: SignInAttemptId | undefined
}

/** Owns the current UI start request and its optional tab separately from Host authorization state. */
export class BrowserLogin {
  private pending: Handoff | undefined

  /** @param destination - maps the Host authorization URL to the page the tab opens, read when the tab navigates. */
  constructor(private readonly destination: (authorizeUrl: string) => string) {}

  /**
   * Preopen a tab and bind it to the attempt returned by the Host.
   * @param request - authenticated Host start request.
   * @param latest - most recent streamed state, including frames received before the response.
   * @param options - carrier selection and the current request's failure report; Desktop opens its page natively.
   * @returns after the request settles; superseded requests cannot change the current handoff. Request failures reject.
   */
  async start(request: () => Promise<AccountView>, latest: () => AccountView | undefined,
    options: { preopen?: boolean; onFailure?: () => void } = {}): Promise<void> {
    this.begin(options.preopen)
    const pending = this.pending
    try {
      const view = await request()
      if (this.pending !== pending) return
      this.follow(view)
      this.update(latest())
    } catch (error) {
      if (this.pending === pending) {
        this.dispose()
        options.onFailure?.()
      }
      throw error
    }
  }

  /**
   * Replace the current handoff during the user's click; unavailable tabs leave the copy-link route available.
   * @param preopen - whether this renderer owns a browser tab, rather than a native Desktop handoff.
   */
  begin(preopen = true): void {
    this.dispose()
    const pending: Handoff = { popup: null, navigated: false, attempt: undefined }
    this.pending = pending
    if (!preopen) return
    try { pending.popup = window.open('about:blank', '_blank') }
    catch (_error) {
      this.unavailable('open')
      return
    }
    if (pending.popup === null) return
    try { pending.popup.opener = null }
    catch (_error) {
      this.close(pending)
      this.unavailable('opener')
    }
  }

  /**
   * Bind the preopened tab to its Host attempt.
   * @param view - initial RPC response identifying this UI's attempt.
   */
  follow(view: AccountView): void {
    if (this.pending === undefined) return
    this.pending.attempt = view.attempt?.id
    this.update(view)
  }

  /**
   * Navigate or close the pending tab when its attempt changes.
   * @param view - latest Host state.
   */
  update(view: AccountView | undefined): void {
    const pending = this.pending
    if (pending === undefined) return
    const attempt = view?.attempt
    if (attempt?.id !== pending.attempt) return
    if (attempt && ['failed', 'expired', 'cancelled'].includes(attempt.phase)) {
      this.dispose()
      return
    }
    if (attempt?.phase === 'succeeded') {
      // A tab that never reached the authorization page stays blank; the Host finished without it.
      this.pending = undefined
      if (!pending.navigated) this.close(pending)
      return
    }
    if (!attempt?.authorizeUrl || pending.navigated) return
    pending.navigated = true
    const popup = pending.popup
    if (popup === null) return
    const destination = this.destination(attempt.authorizeUrl)
    try { if (!popup.closed) popup.location.replace(destination) }
    catch (_error) {
      this.close(pending)
      this.unavailable('navigate')
    }
  }

  /** Retire the current request before closing its tab; late RPC results cannot affect a later handoff. */
  dispose(): void {
    const pending = this.pending
    this.pending = undefined
    if (pending !== undefined) this.close(pending)
  }

  private close(pending: Handoff): void {
    const popup = pending.popup
    pending.popup = null
    try { popup?.close() }
    catch (_error) { this.unavailable('close') }
  }

  private unavailable(operation: 'open' | 'opener' | 'navigate' | 'close'): void {
    console.warn('[account] Authorization tab unavailable; use Copy link to continue', { operation })
  }
}
