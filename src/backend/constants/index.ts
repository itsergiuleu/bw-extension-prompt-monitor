export const STORAGE_KEYS = {
  HISTORY: 'issue_history',
} as const;

export const CHATGPT_ENDPOINTS = [
  'backend-api/f/conversation'
] as const;

export const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

export const MAX_HISTORY_ITEMS = 1000;