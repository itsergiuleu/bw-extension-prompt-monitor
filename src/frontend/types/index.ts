import { Issue } from '@/shared/types';

export interface AppState {
  currentIssues: string[];
  history: Issue[];
  isModalOpen: boolean;
  pendingRequest?: PendingRequest;
}

export interface AppActions {
  dismissEmail: (email: string) => Promise<void>;
  maskAndSend: () => Promise<void>;
  cancelRequest: () => Promise<void>;
  loadHistory: () => Promise<void>;
}

export interface AppContextValue extends AppActions {
  state: AppState;
}

export interface PendingRequest {
  body: string;
  requestId: string;
}

export interface EmailItemProps {
  issueEmail: string;
  isLoading?: boolean;
}

export interface HistoryItemProps {
  issue: Issue;
}