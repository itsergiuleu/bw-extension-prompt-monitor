import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/frontend/context/AppContext';
import { IssuesFoundTab } from './IssuesFoundTab';
import { HistoryTab } from './HistoryTab';
import { TAB_NAMES, MODAL_ANIMATION_DURATION } from '@/frontend/constants';

type TabType = 'issues' | 'history';

export const Modal: React.FC = () => {
  const { state, cancelRequest } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>('issues');
  const [isAnimating, setIsAnimating] = useState(false);

  // Reset to issues tab when modal opens
  useEffect(() => {
    if (state.isModalOpen) {
      setActiveTab('issues');
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), MODAL_ANIMATION_DURATION);
    }
  }, [state.isModalOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isModalOpen) {
        cancelRequest();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state.isModalOpen, cancelRequest]);

  const handleClose = async () => {
    await cancelRequest();
  };

  const handleTabChange = (tab: TabType) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  if (!state.isModalOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="pm-backdrop"
        onClick={handleClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className={`pm-modal ${isAnimating ? 'pm-modal-animating' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-modal-title"
      >
        {/* Header */}
        <div className="pm-modal-header">
          <div className="pm-modal-title-wrapper">
            <svg
              className="pm-modal-icon"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z" />
            </svg>
            <h2 id="pm-modal-title" className="pm-modal-title">
              Prompt Monitor
            </h2>
          </div>

          <button
            className="pm-close-button"
            onClick={handleClose}
            aria-label="Close modal"
            disabled={activeTab === 'issues' && state.currentIssues.length > 0}
            title={
              activeTab === 'issues' && state.currentIssues.length > 0
                ? 'Please handle detected issues first'
                : 'Close'
            }
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="pm-tabs" role="tablist">
          <button
            className={`pm-tab ${activeTab === 'issues' ? 'pm-tab-active' : ''}`}
            onClick={() => handleTabChange('issues')}
            role="tab"
            aria-selected={activeTab === 'issues'}
            aria-controls="pm-tab-issues"
          >
            <svg className="pm-tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
            </svg>
            {TAB_NAMES.ISSUES}
            {state.currentIssues.length > 0 && (
              <span className="pm-tab-badge">{state.currentIssues.length}</span>
            )}
          </button>

          <button
            className={`pm-tab ${activeTab === 'history' ? 'pm-tab-active' : ''}`}
            onClick={() => handleTabChange('history')}
            role="tab"
            aria-selected={activeTab === 'history'}
            aria-controls="pm-tab-history"
          >
            <svg className="pm-tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
              <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
              <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
            </svg>
            {TAB_NAMES.HISTORY}
            {state.history.length > 0 && (
              <span className="pm-tab-badge">{state.history.length}</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="pm-tab-panels">
          {activeTab === 'issues' ? (
            <div
              id="pm-tab-issues"
              role="tabpanel"
              aria-labelledby="pm-tab-issues-button"
              className="pm-tab-panel"
            >
              <IssuesFoundTab />
            </div>
          ) : (
            <div
              id="pm-tab-history"
              role="tabpanel"
              aria-labelledby="pm-tab-history-button"
              className="pm-tab-panel"
            >
              <HistoryTab />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
