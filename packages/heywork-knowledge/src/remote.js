/**
 * @heywork/knowledge — typert Remote descriptors for the 25 @Remote methods.
 *
 * FROM SPEC, NOT COPIED. Implements specs/knowledge.md §1.1 / §五 verbatim:
 * id prefix `knowledge/`, service `knowledge`, invocation kind `direct`,
 * cancellation parameter `signal`, strict request/result codecs.
 * NOTE: this is NOT a defineTool surface — no output/render/presentCall.
 *
 * 待确认: §1.1 says each method's sourceLocation line/column differs but does
 * not enumerate them; we use deterministic placeholders (TC-7 conservative).
 */

import { IDENTITY, COLLECTION_KINDS, SEARCH_MODES, EXPERIENCE_LIST_STATES,
  EXPERIENCE_STATES } from './deps.js'

const P = IDENTITY.typePackage
const T = (type) => `${P}/types#${type}`
const M = (method, part) => `${P}#knowledge/${method}:${part}`
const SOURCE_FILE = 'packages/knowledge/knowledge/src/index.ts'

/**
 * Frozen method table (spec §五): id suffix -> { signature, requestType,
 * resultType, requestJson }. `catalog` alone has no request parameter.
 */
export const METHODS = Object.freeze([
  { key: 'catalog', noRequest: true,
    requestType: null, resultType: T('KnowledgeCatalog'), signature: 'catalog(): KnowledgeCatalog',
    requestJson: null },
  { key: 'createTeam', requestType: M('createTeam', 'request'), resultType: M('createTeam', 'result'),
    signature: 'createTeam(request: { name: string }): KnowledgeTeam',
    requestJson: { name: 'string' } },
  { key: 'createBase', requestType: T('KnowledgeBaseInput'), resultType: T('KnowledgeBase'),
    signature: 'createBase(request: KnowledgeBaseInput): KnowledgeBase',
    requestJson: { name: 'string', description: 'string', kind: 'enum:team|project', teamId: 'string|null',
      workspaceIds: 'string[]', mode: 'enum:fulltext|hybrid', enabled: 'boolean' } },
  { key: 'updateBase', requestType: M('updateBase', 'request'), resultType: M('updateBase', 'result'),
    signature: 'updateBase(request: { id: KnowledgeBaseId; input: KnowledgeBaseInput }): KnowledgeBase',
    requestJson: { id: 'uuid', input: 'KnowledgeBaseInput' } },
  { key: 'archiveBase', requestType: M('archiveBase', 'request'), resultType: M('archiveBase', 'result'),
    signature: 'archiveBase(request: { id: KnowledgeBaseId; archived: boolean }): boolean',
    requestJson: { id: 'uuid', archived: 'boolean' } },
  { key: 'detail', requestType: M('detail', 'request'), resultType: T('KnowledgeDetail'),
    signature: 'detail(request: { id: KnowledgeBaseId; includeArchived?: boolean }): KnowledgeDetail',
    requestJson: { id: 'uuid', includeArchived: 'boolean?' } },
  { key: 'upload', requestType: T('KnowledgeUpload'), resultType: T('KnowledgeImportReceipt'),
    signature: 'upload(request: KnowledgeUpload): Promise<KnowledgeImportReceipt>',
    requestJson: { baseId: 'uuid', name: 'string', base64: 'string' } },
  { key: 'note', requestType: T('KnowledgeNote'), resultType: T('KnowledgeImportReceipt'),
    signature: 'note(request: KnowledgeNote): Promise<KnowledgeImportReceipt>',
    requestJson: { baseId: 'uuid', name: 'string', text: 'string' } },
  { key: 'createNoteIfAbsent', requestType: T('KnowledgeNote'), resultType: T('KnowledgeImportReceipt'),
    signature: 'createNoteIfAbsent(request: KnowledgeNote): Promise<KnowledgeImportReceipt>',
    requestJson: { baseId: 'uuid', name: 'string', text: 'string' } },
  { key: 'importLocal', requestType: T('KnowledgeLocalImport'), resultType: T('KnowledgeImportReceipt'),
    signature: 'importLocal(request: KnowledgeLocalImport): Promise<KnowledgeImportReceipt>',
    requestJson: { baseId: 'uuid', path: 'string', kind: 'enum:file|folder|auto', watch: 'boolean' } },
  { key: 'watchSource', requestType: M('watchSource', 'request'), resultType: M('watchSource', 'result'),
    signature: 'watchSource(request: { id: KnowledgeSourceId; watch: boolean }): boolean',
    requestJson: { id: 'uuid', watch: 'boolean' } },
  { key: 'syncSource', requestType: M('syncSource', 'request'), resultType: M('syncSource', 'result'),
    signature: 'syncSource(request: { id: KnowledgeSourceId }): Promise<KnowledgeImportReceipt>',
    requestJson: { id: 'uuid' } },
  { key: 'updateDocument', requestType: M('updateDocument', 'request'), resultType: M('updateDocument', 'result'),
    signature: 'updateDocument(request: { id; enabled: boolean; archived: boolean; title: string }): KnowledgeDocument',
    requestJson: { id: 'uuid', enabled: 'boolean', archived: 'boolean', title: 'string' } },
  { key: 'retryDocument', requestType: M('retryDocument', 'request'), resultType: M('retryDocument', 'result'),
    signature: 'retryDocument(request: { id: KnowledgeDocumentId }): boolean',
    requestJson: { id: 'uuid' } },
  { key: 'document', requestType: M('document', 'request'), resultType: T('KnowledgeDocumentDetail'),
    signature: 'document(request: { id: KnowledgeDocumentId; offset: number }): KnowledgeDocumentDetail',
    requestJson: { id: 'uuid', offset: 'number' } },
  { key: 'restoreRevision', requestType: M('restoreRevision', 'request'), resultType: M('restoreRevision', 'result'),
    signature: 'restoreRevision(request: { id: KnowledgeDocumentId; revision: string }): boolean',
    requestJson: { id: 'uuid', revision: 'string' } },
  { key: 'original', requestType: M('original', 'request'), resultType: M('original', 'result'),
    signature: 'original(request: { id: KnowledgeDocumentId; revision: string }): Promise<{ name: string; data: Uint8Array }>',
    requestJson: { id: 'uuid', revision: 'string' } },
  { key: 'search', requestType: T('KnowledgeQuery'), resultType: T('KnowledgeSearchResult'),
    signature: 'search(request: KnowledgeQuery): Promise<KnowledgeSearchResult>',
    requestJson: { query: 'string', baseIds: 'uuid[]', workspaceId: 'string?' } },
  { key: 'experienceCapture', requestType: M('experienceCapture', 'request'), resultType: M('experienceCapture', 'result'),
    signature: 'experienceCapture(request: { baseId: KnowledgeBaseId }): boolean',
    requestJson: { baseId: 'uuid' } },
  { key: 'setExperienceCapture', requestType: M('setExperienceCapture', 'request'), resultType: M('setExperienceCapture', 'result'),
    signature: 'setExperienceCapture(request: { baseId: KnowledgeBaseId; enabled: boolean }): Promise<boolean>',
    requestJson: { baseId: 'uuid', enabled: 'boolean' } },
  { key: 'listExperiences', requestType: M('listExperiences', 'request'), resultType: M('listExperiences', 'result'),
    signature: 'listExperiences(request: { baseId; query; state; offset; limit }): { items: KnowledgeExperience[]; total: number }',
    requestJson: { baseId: 'uuid', query: 'string', state: `enum:${EXPERIENCE_LIST_STATES.join('|')}`,
      offset: 'number', limit: 'number' } },
  { key: 'experienceHistory', requestType: M('experienceHistory', 'request'), resultType: M('experienceHistory', 'result'),
    signature: 'experienceHistory(request: { id; offset; limit }): Promise<{ items: KnowledgeExperience[]; total: number }>',
    requestJson: { id: 'uuid', offset: 'number', limit: 'number' } },
  { key: 'saveExperience', requestType: M('saveExperience', 'request'), resultType: M('saveExperience', 'result'),
    signature: 'saveExperience(request: { baseId; id: KnowledgeExperienceId|null; expectedRevision: number|null; content }): Promise<KnowledgeExperience>',
    requestJson: { baseId: 'uuid', id: 'uuid|null', expectedRevision: 'number|null', content: 'KnowledgeExperienceInput' } },
  { key: 'transitionExperience', requestType: M('transitionExperience', 'request'), resultType: M('transitionExperience', 'result'),
    signature: 'transitionExperience(request: { id; expectedRevision; state; review; supersededBy }): Promise<KnowledgeExperience>',
    requestJson: { id: 'uuid', expectedRevision: 'number', state: `enum:${EXPERIENCE_STATES.join('|')}`,
      review: 'string', supersededBy: 'uuid|null' } },
  { key: 'deleteExperience', requestType: M('deleteExperience', 'request'), resultType: M('deleteExperience', 'result'),
    signature: 'deleteExperience(request: { id: KnowledgeExperienceId; expectedRevision: number }): Promise<boolean>',
    requestJson: { id: 'uuid', expectedRevision: 'number' } },
])

function jsonSchemaFor(requestJson) {
  if (!requestJson) return null
  const properties = {}
  for (const [name, kind] of Object.entries(requestJson)) {
    if (kind.endsWith('?')) properties[name] = { type: kind.slice(0, -1) }
    else if (kind.startsWith('enum:')) properties[name] = { type: 'string', enum: kind.slice(5).split('|') }
    else if (kind === 'uuid[]') properties[name] = { type: 'array', items: { type: 'string' } }
    else if (kind === 'string[]') properties[name] = { type: 'array', items: { type: 'string' } }
    else if (kind.includes('|')) properties[name] = { oneOf: kind.split('|').map((t) => ({ type: t })) }
    else properties[name] = { type: kind }
  }
  return { type: 'object', properties, required: Object.keys(properties), additionalProperties: true }
}

/**
 * Build all 25 descriptors. Implementation handlers are bound when supplied.
 * `createSchema` (injected zod-like factory) is applied if available.
 */
export function buildDescriptors(implementation = {}, createSchema = undefined) {
  const create = (schema) => (createSchema ? createSchema(schema) : ((value) => value))
  const descriptors = {}

  METHODS.forEach((method, index) => {
    const id = `${IDENTITY.invocationPrefix}${method.key}`
    const sourceLocation = {
      file: SOURCE_FILE,
      line: 100 + index,          // TC: not enumerated per-method in spec §1.1
      column: method.noRequest ? 3 : 9,
    }
    const requestSchema = jsonSchemaFor(method.requestJson)
    const descriptor = {
      id,
      service: IDENTITY.service,
      signature: method.signature,
      invocation: { kind: 'direct' },
      parameters: method.noRequest ? [] : [{
        name: 'request',
        source: 'json',
        codec: {
          mode: 'strict',
          typeSymbol: method.requestType,
          jsonSchema: requestSchema,
          create: create(requestSchema),
        },
        strictCodec: {
          mode: 'strict',
          typeSymbol: method.requestType,
          jsonSchema: { ...requestSchema, additionalProperties: false },
          create: create({ ...requestSchema, additionalProperties: false }),
        },
      }],
      cancellation: { parameter: 'signal' },
      result: {
        mode: 'strict',
        typeSymbol: method.resultType,
        jsonSchema: { type: 'object', additionalProperties: true },
        create: create({ type: 'object', additionalProperties: true }),
      },
      sourceLocation,
    }
    if (typeof implementation[method.key] === 'function') {
      descriptor.implementation = implementation[method.key]
    }
    descriptors[id] = descriptor
  })

  return Object.freeze(descriptors)
}

export const REMOTE_IDS = Object.freeze(METHODS.map((m) => `${IDENTITY.invocationPrefix}${m.key}`))
