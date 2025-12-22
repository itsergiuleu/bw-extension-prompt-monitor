import { useEffect, Dispatch, SetStateAction } from 'react';
import { AppState, PendingRequest } from '@/frontend/types';
import { MESSAGE_TYPES, ISSUE_STATUS } from '@/shared/constants';
import { MessagingService } from '@/frontend/services/messaging.service';
import {getRemainingTime} from "@/frontend/utils/dismissal";

interface UseMessageListenerProps {
  history: AppState['history'];
  setState: Dispatch<SetStateAction<AppState>>;
}

export const useMessageListener = ({ history, setState }: UseMessageListenerProps) => {
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type !== MESSAGE_TYPES.ISSUE) {
        return;
      }

      const { emails, request, requestId } = event.data;

      const pendingRequest: PendingRequest = {
        body: request.body,
        requestId,
      };

      const dismissedEmails = history
        .filter(issue => emails.includes(issue.email) && issue.status === ISSUE_STATUS.DISMISSED && getRemainingTime(issue.dismissedUntil) > 0)
        .map(issue => issue.email);

      const currentIssues: string[] = emails.filter(
        (email: string) => !dismissedEmails.includes(email)
      );

      if (currentIssues.length === 0) {
        MessagingService.sendContinueAction(requestId, request.body);
        setState(prev => ({ ...prev }));
        return;
      }

      setState(prev => ({
        ...prev,
        currentIssues,
        isModalOpen: true,
        pendingRequest,
      }));
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [history, setState]);
};