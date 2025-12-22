import React from 'react';
import { HistoryItemProps } from '@/frontend/types';
import { formatRemainingTime, getRemainingTime } from '@/frontend//utils/dismissal';
import { ISSUE_STATUS } from '@/shared/constants';
import { STATUS_COLORS } from '@/frontend/constants';

export const HistoryItem: React.FC<HistoryItemProps> = ({ issue }) => {
  const getStatusBadge = () => {
    const statusConfig = {
      pending: { label: 'Pending', color: STATUS_COLORS.pending },
      sent: { label: 'Sent', color: STATUS_COLORS.sent },
      dismissed: { label: 'Dismissed', color: STATUS_COLORS.dismissed },
      blocked: { label: 'Blocked', color: STATUS_COLORS.blocked },
    };

    const config = statusConfig[issue.status];

    return (
      <span
        className="pm-status-badge"
        style={{ backgroundColor: config.color }}
      >
        {config.label}
      </span>
    );
  };

  const remaining = getRemainingTime(issue?.dismissedUntil);

  return (
    <div className="pm-history-item">
      <div className="pm-history-header">
        <div className="pm-history-email">
          <svg
            className="pm-email-icon"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z" />
          </svg>
          <span>{issue.email}</span>
        </div>
        {getStatusBadge()}
      </div>

      <div className="pm-history-meta">
        {issue.status === ISSUE_STATUS.DISMISSED && remaining > 0 && (
          <span className="pm-history-dismissal">
            Expires in {formatRemainingTime(remaining)}
          </span>
        )}
      </div>
    </div>
  );
};
