/** Static HTML preview with no scripts, network resources, forms or nested frames. */
import { createStaticHtmlDocument } from '@deepseek-ai/dsh-client-ui-primitives'
import { decodeText } from './bytes.ts'

/**
 * Prepare static content before the browser can load any document resources.
 * @param data - Complete UTF-8 HTML bytes.
 * @returns An isolated static document; invalid UTF-8 throws.
 */
export function createBasicHtmlDocument(data: Uint8Array<ArrayBuffer>): string {
  return createStaticHtmlDocument(decodeText(data))
}
