import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppState,
  AppContextValue,
} from '@/frontend/types';
import { anonymizeRequestBody } from '@/frontend/utils/anonymize';
import { MessagingService } from '@/frontend/services/messaging.service';
import { useMessageListener } from '@/frontend/hooks/useMessageListener';

const initialState: AppState = {
  currentIssues: [],
  history: [],
  isModalOpen: false,
  pendingRequest: undefined,
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const loadHistory = useCallback(async () => {
    try {
      const history = await MessagingService.getHistory();
      setState((prev) => ({ ...prev, history }));
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const history = await MessagingService.getHistory();
        if (!cancelled) {
          setState((prev) => ({ ...prev, history }));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load history:', error);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useMessageListener({ history: state.history, setState });

  const dismissEmail = useCallback(async (email: string) => {
    setState((prev) => {
      const filteredCurrentIssues = prev.currentIssues.filter(issueEmail => issueEmail !== email);

      MessagingService.sendDismissAction(
        [email],
        filteredCurrentIssues.length === 0 ? prev.pendingRequest?.requestId : undefined,
        filteredCurrentIssues.length === 0 ? prev.pendingRequest?.body : undefined
      );

      return {
        ...prev,
        currentIssues: filteredCurrentIssues,
        isModalOpen: filteredCurrentIssues.length > 0,
      };
    });

    await loadHistory();
  }, [loadHistory]);

  const maskAndSend = useCallback(async () => {
    setState((prev) => {
      MessagingService.sendMaskAction(
          prev.currentIssues!,
          prev.pendingRequest!.requestId,
          anonymizeRequestBody(prev.pendingRequest!.body, prev.currentIssues)
      );

      return {
        ...prev,
        isModalOpen: false,
        pendingRequest: undefined,
      };
    });

    await loadHistory();
  }, [loadHistory]);

  const cancelRequest = useCallback(async () => {
    setState((prev) => {
      MessagingService.sendCancelAction(
        prev.pendingRequest?.requestId,
        prev.pendingRequest?.body
      );

      return {
        ...prev,
        currentIssues: [],
        isModalOpen: false,
        pendingRequest: undefined,
      };
    });
  }, []);

  const contextValue: AppContextValue = {
    state,
    dismissEmail,
    maskAndSend,
    cancelRequest,
    loadHistory,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }

  return context;
};