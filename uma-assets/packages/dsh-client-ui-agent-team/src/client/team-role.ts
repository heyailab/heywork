/** Role presentation shared by live activity and durable messages. */
import { IconChecklistOutlineRegular, IconCodeOutlineRegular, IconEyeOutlineRegular, IconLayersOutlineRegular, IconShieldOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
const roles = {
  pm: { label: 'role.product', icon: IconChecklistOutlineRegular },
  architect: { label: 'role.architect', icon: IconLayersOutlineRegular },
  designer: { label: 'role.design', icon: IconLayersOutlineRegular },
  frontend: { label: 'role.frontend', icon: IconCodeOutlineRegular },
  backend: { label: 'role.backend', icon: IconCodeOutlineRegular },
  qa: { label: 'role.qa', icon: IconEyeOutlineRegular },
  reviewer: { label: 'role.reviewer', icon: IconEyeOutlineRegular },
  security: { label: 'role.security', icon: IconShieldOutlineRegular },
  devops: { label: 'role.devops', icon: IconCodeOutlineRegular },
  wiki: { label: 'role.wiki', icon: IconChecklistOutlineRegular },
} as const

/**
 * Resolve generated member names to their declared role.
 * @param name - Recorded member handle.
 * @returns Role presentation when recognized.
 */
export function teamRole(name: string | undefined): (typeof roles)[keyof typeof roles] | undefined {
  const key = name?.replace(/[-_]?\d+$/u, '')
  return key !== undefined && Object.hasOwn(roles, key) ? roles[key as keyof typeof roles] : undefined
}
