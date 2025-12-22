export const TAB_NAMES = {
  ISSUES: 'Issues Found',
  HISTORY: 'History',
} as const;

export const MODAL_ANIMATION_DURATION = 300; // ms

export const STATUS_COLORS = {
  pending: '#f59e0b', // amber
  sent: '#10b981', // green
  dismissed: '#6b7280', // gray
  blocked: '#ef4444', // red
} as const;

export const EMAIL_PLACEHOLDER_PREFIX = '[EMAIL_';
export const EMAIL_PLACEHOLDER_SUFFIX = ']';