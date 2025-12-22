export const MESSAGE_TYPES = {
  ISSUE: 'PROMPT_MONITOR_DETECTED',
  ACTION: 'PROMPT_MONITOR_ACTION',
  GET: 'PROMPT_MONITOR_GET',
} as const;

export const ACTION_TYPES = {
  CONTINUE: 'continue',
  MASK: 'mask',
  CANCEL: 'cancel',
  DISMISS: 'dismiss',
  GET_HISTORY: 'get_history'
} as const;

export const ISSUE_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  DISMISSED: 'dismissed',
  BLOCKED: 'blocked',
} as const;
