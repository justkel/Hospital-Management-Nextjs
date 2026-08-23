// Codes where the access token itself is simply expired/missing —
// a refresh can plausibly fix these.
export const REFRESHABLE_AUTH_CODES = ['UNAUTHENTICATED'] as const;

// Codes where refreshing cannot help — the session or account is
// terminally invalid and the user must be logged out and redirected.
export const FORCE_LOGOUT_CODES = [
  'TOKEN_REVOKED',
  'PASSWORD_CHANGED',
  'ACCOUNT_INACTIVE',
  'GUEST_BLOCKED',
  'GUEST_ACCESS_DENIED',
  'GUEST_ACCESS_UNVERIFIABLE',
  'GUEST_ACCESS_EXPIRED',
  'GUEST_INVALID',
  'GUEST_ACCESS_DISABLED',
] as const;

export type RefreshableAuthCode = (typeof REFRESHABLE_AUTH_CODES)[number];
export type ForceLogoutCode = (typeof FORCE_LOGOUT_CODES)[number];
export type AuthErrorCode = RefreshableAuthCode | ForceLogoutCode;