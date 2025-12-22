import React, { useState} from 'react';
import { EmailItemProps } from '@/frontend/types';
import {useAppContext} from "@/frontend/context/AppContext";

export const EmailItem: React.FC<EmailItemProps> = ({ issueEmail, isLoading }) => {
  const [dismissing, setDismissing] = useState(false);
  const { dismissEmail } = useAppContext();
  const onDismiss = dismissEmail;

  const handleDismiss = async () => {
    setDismissing(true);
    try {
      await onDismiss(issueEmail);
    } catch (error) {
      console.error('Failed to dismiss email:', error);
    } finally {
      setDismissing(false);
    }
  };

  return (
    <div className="pm-email-item">
      <div className="pm-email-content">
        <svg
          className="pm-email-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
        </svg>
        <span className="pm-email-address">{issueEmail}</span>
      </div>

      {(
          <button
              className="pm-dismiss-button"
              onClick={handleDismiss}
              disabled={dismissing || isLoading}
          >
            {dismissing ? 'Dismissing...' : 'Dismiss'}
          </button>
      )}
    </div>
  );
};
