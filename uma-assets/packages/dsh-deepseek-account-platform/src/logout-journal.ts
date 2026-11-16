/** Credential-owned intents for remote revocation after local account removal. */
import { z } from 'zod'
import type { CredentialKey, CredentialProvider, CredentialRecord } from '@deepseek-ai/dsh-credentials'
import type { AccountClientMetadata } from '@deepseek-ai/dsh-deepseek-account'
import type { Branded } from '@deepseek-ai/dsh-brand'
import { PlatformAuthError } from './protocol.ts'

type LogoutEntryId = Branded<'LogoutEntryId'>
const entry = z.object({
  id: z.uuid().transform(value => value as LogoutEntryId), token: z.string().min(1), binding: z.string().min(1),
  client: z.object({ version: z.string(), locale: z.string(), timezoneOffsetSeconds: z.number() }).strict(),
  status: z.enum(['prepared', 'pending', 'failed']),
}).strict()
const journal = z.object({ version: z.literal(1), issuer: z.url(), entries: z.array(entry) }).strict()
  .refine(value => new Set(value.entries.map(item => item.id)).size === value.entries.length
    && new Set(value.entries.map(item => item.binding)).size === value.entries.length)

/** A captured old grant; it is never consulted by request-authentication consumers. */
export type LogoutEntry = z.infer<typeof entry>

async function stored<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation() }
  catch (error) {
    if (error instanceof PlatformAuthError) throw error
    throw new PlatformAuthError('storage')
  }
}

/** Serialized credential mutations preserve concurrent additions and exact revocation identities. */
export class LogoutJournal {
  /**
   * @param credentials - secret record owner.
   * @param key - deployment-scoped journal address.
   * @param origin - validated issuer.
   * @param block - stop credential use when the stored journal cannot be interpreted.
   */
  constructor(private readonly credentials: CredentialProvider, private readonly key: CredentialKey,
    private readonly origin: string, private readonly block: () => void) {}

  private unreadable(code: 'storage' | 'protocol'): never {
    this.block()
    throw new PlatformAuthError(code)
  }

  private parse(record: CredentialRecord | undefined): LogoutEntry[] {
    if (record === undefined) return []
    if (record.kind !== 'grant') return this.unreadable('storage')
    const parsed = journal.safeParse(record.payload)
    if (!parsed.success) return this.unreadable('storage')
    if (parsed.data.issuer !== this.origin) return this.unreadable('protocol')
    return parsed.data.entries
  }

  private modify(mutation: (current: CredentialRecord | undefined) => CredentialRecord | undefined): Promise<CredentialRecord | undefined> {
    return stored(() => this.credentials.modifyRecord(this.key, current => Promise.resolve(mutation(current))))
  }

  /**
   * Read the issuer-bound revocation journal.
   * @returns captured revocations, refusing malformed, future-version and foreign-issuer records.
   */
  async read(): Promise<LogoutEntry[]> {
    try { return this.parse(await stored(() => this.credentials.readRecord(this.key))) }
    catch (error) { this.block(); throw error }
  }

  /**
   * Persist one captured revocation intent.
   * @param value - captured grant and caller metadata.
   * @returns after the intent is durable; duplicate bindings retain the original intent.
   */
  async append(value: LogoutEntry): Promise<void> {
    await this.modify((current) => {
      const entries = this.parse(current)
      if (entries.some(item => item.binding === value.binding)) return undefined
      return { kind: 'grant', payload: { version: 1, issuer: this.origin, entries: [...entries, value] } }
    })
  }

  /**
   * Admit an intent after its matching local grant has been removed.
   * @param id - intent whose matching local grant was removed.
   * @returns after persisting admission; missing or already admitted intents remain unchanged.
   */
  async ready(id: LogoutEntryId): Promise<void> {
    await this.modify((current) => {
      const entries = this.parse(current)
      if (!entries.some(item => item.id === id && item.status === 'prepared')) return undefined
      return { kind: 'grant', payload: { version: 1, issuer: this.origin,
        entries: entries.map(item => item.id === id ? { ...item, status: 'pending' } : item) } }
    })
  }

  /**
   * Persist the exhausted retry outcome for one captured intent.
   * @param id - captured intent.
   * @returns after its exhausted retry outcome is durable, without changing other intents.
   */
  async fail(id: LogoutEntryId): Promise<void> {
    await this.modify((current) => {
      const entries = this.parse(current)
      if (!entries.some(item => item.id === id)) return undefined
      return { kind: 'grant', payload: { version: 1, issuer: this.origin,
        entries: entries.map(item => item.id === id ? { ...item, status: 'failed' } : item) } }
    })
  }

  /**
   * Admit a new bounded retry run after the caller completes matching local removals.
   * @param client - identity of the UI requesting another retry.
   * @returns intents admitted to the new retry run.
   */
  async retry(client: AccountClientMetadata): Promise<LogoutEntry[]> {
    const result = await this.modify((current) => {
      const entries = this.parse(current)
      if (entries.length === 0) return undefined
      return { kind: 'grant', payload: { version: 1, issuer: this.origin,
        entries: entries.map(item => ({ ...item, client, status: 'pending' })) } }
    })
    return this.parse(result)
  }

  /**
   * Remove one acknowledged intent while preserving concurrent additions.
   * @param id - successfully revoked intent.
   * @returns after removing only that intent and an unchanged empty journal.
   */
  async remove(id: LogoutEntryId): Promise<void> {
    const result = await this.modify((current) => {
      const entries = this.parse(current)
      if (!entries.some(item => item.id === id)) return undefined
      return { kind: 'grant', payload: { version: 1, issuer: this.origin, entries: entries.filter(item => item.id !== id) } }
    })
    if (result === undefined || this.parse(result).length !== 0) return
    await stored(() => this.credentials.deleteRecord(this.key, current => this.parse(current).length === 0))
  }
}
