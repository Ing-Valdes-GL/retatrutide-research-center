export const ADMIN_EMAILS = [
  'doungmolagoungvaldes@gmail.com',
  'kentrellzaza83@gmail.com',
] as const

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase() as (typeof ADMIN_EMAILS)[number])
}
