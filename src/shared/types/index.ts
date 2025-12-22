import { ACTION_TYPES, ISSUE_STATUS, MESSAGE_TYPES } from '@/shared/constants';

export type IssueStatus = typeof ISSUE_STATUS[keyof typeof ISSUE_STATUS];
export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];
export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

export interface SendMessage {
  type: MessageType;
  action: ActionType;
  data?: SendMessageData;
}

export interface SendMessageData {
  issueEmails: string[];
}

export interface WindowMessagePayload {
  type: MessageType;
  action: ActionType;
  requestId?: string;
  body?: string;
}

export interface Issue {
  id: string;
  email: string;
  timestamp: number;
  status: IssueStatus;
  dismissedUntil?: number;
}
