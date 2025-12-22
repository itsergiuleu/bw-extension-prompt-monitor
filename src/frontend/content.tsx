import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from '@/frontend/context/AppContext';
import { Modal } from '@/frontend/components/Modal';
import { browserAPI } from '@/shared/utils/runtime';
import '@/frontend/styles/modal.css';

const initModal = () => {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'prompt-monitor-root';
  document.body.appendChild(modalRoot);

  const root = ReactDOM.createRoot(modalRoot);

  root.render(
    <AppProvider>
      <Modal />
    </AppProvider>
  );

  console.log('[Content] Modal initialized');
};

const injectInterceptor = () => {
  const script = document.createElement('script');
  script.src = browserAPI.runtime.getURL('inject-fetch-interceptor.js');
  script.onload = () => {
    console.log('[Content] Fetch interceptor injected');
    script.remove();
  };
  script.onerror = () => {
    console.error('[Content] Failed to inject fetch interceptor');
  };
  (document.head || document.documentElement).prepend(script);
};

/**
 * Initialize extension
 */
const init = () => {
  try {
    injectInterceptor();
    initModal();

    console.log('[Content] Prompt Monitor initialized');
  } catch (error) {
    console.error('[Content] Initialization failed:', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
