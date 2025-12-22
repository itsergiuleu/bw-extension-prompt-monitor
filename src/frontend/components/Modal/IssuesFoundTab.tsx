import React, {useState} from 'react';
import { EmailItem } from './EmailItem';
import {useAppContext} from "@/frontend/context/AppContext";

export const IssuesFoundTab: React.FC = ({}) => {
  const { state, maskAndSend, cancelRequest, dismissEmail } = useAppContext();
  const onMaskAndSend = maskAndSend;
  const onCancel = cancelRequest;
  const issues = state.currentIssues;

  const [isProcessing, setIsProcessing] = useState(false);

  const handleMaskAndSend = async () => {
    setIsProcessing(true);
    try {
      await onMaskAndSend();
    } catch (error) {
      console.error('Failed to mask and send:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await onCancel();
    } catch (error) {
      console.error('Failed to cancel:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (issues.length === 0) {
    return (
      <div className="pm-tab-content">
        <div className="pm-empty-state">
          <svg
            className="pm-empty-icon"
            width="48"
            height="48"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
            />
            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
          </svg>
          <p className="pm-empty-message">No issues detected</p>
          <p className="pm-empty-submessage">
            All detected emails have been dismissed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-tab-content">
      <div className="pm-issues-header">
        <h3 className="pm-issues-title">
          <svg
            className="pm-warning-icon"
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
          </svg>
          Sensitive Data Detected
        </h3>
        <p className="pm-issues-description">
          We detected {issues.length} email address{issues.length === 1 ? '' : 'es'} in
          your prompt. You can dismiss individual emails for 24 hours, or anonymize them before
          sending.
        </p>
      </div>

      <div className="pm-email-list">
        {issues.map((issueEmail, index) => (
          <EmailItem
            key={issueEmail + index}
            issueEmail={issueEmail}
            isLoading={isProcessing}
          />
        ))}
      </div>

      <div className="pm-actions">
        <button
          className="pm-button pm-button-primary"
          onClick={handleMaskAndSend}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="pm-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <svg
                className="pm-button-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z" />
              </svg>
              Mask & Send
            </>
          )}
        </button>

        <button
          className="pm-button pm-button-secondary"
          onClick={handleCancel}
          disabled={isProcessing}
        >
          <svg
            className="pm-button-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
          Cancel
        </button>
      </div>
    </div>
  );
};
