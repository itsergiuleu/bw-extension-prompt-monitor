import React from 'react';
import { HistoryItem } from './HistoryItem';
import {useAppContext} from "../../context/AppContext";

export const HistoryTab: React.FC = ({}) => {
  const { state } = useAppContext();

  if (state.history.length === 0) {
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
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
          </svg>
          <p className="pm-empty-message">No history yet</p>
          <p className="pm-empty-submessage">
            Your issue history will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pm-tab-content">
      <div className="pm-history-list">
        {state.history.map((issue) => (
          <HistoryItem key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};