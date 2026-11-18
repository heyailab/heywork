/** UMA account appearance for the veteran award. */
import { AccountAvatar } from './AccountAvatar.tsx'
import type { AccountAvatarSnapshot } from './account-avatar.ts'
import veteranBadge from './assets/uma-beta-veteran.png'
import veteranFrame from './assets/uma-beta-veteran-frame.webp'
import css from './UmaAccountAppearance.module.css'

/**
 * Render a decorative avatar next to the account identity.
 * @param props - picture load outcome, failure reporter and optional veteran frame.
 * @returns picture or the default account icon.
 */
export function UmaAccountAvatar({ avatar, avatarFailed, veteran = false }: {
  avatar: AccountAvatarSnapshot | undefined
  avatarFailed: (snapshot: AccountAvatarSnapshot) => void
  veteran?: boolean
}) {
  const picture = <AccountAvatar avatar={avatar} avatarFailed={avatarFailed} />
  if (!veteran) return picture
  return <span className={css.framed} aria-hidden="true">
    <span className={css.framedPicture}>{picture}</span>
    <img className={css.frame} src={veteranFrame} alt="" draggable={false} />
  </span>
}

/**
 * Render the veteran badge beside the account name.
 * @param props - localized badge name and compact sidebar sizing.
 * @returns The badge image with its intrinsic aspect ratio.
 */
export function BetaVeteranBadge({ label, compact = false }: { label: string; compact?: boolean }) {
  return <img className={css.badge} data-compact={compact || undefined} src={veteranBadge} alt={label} draggable={false} />
}
