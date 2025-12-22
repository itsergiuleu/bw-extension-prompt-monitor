import { FetchInterceptorService } from '@/backend/services/fetch-interceptor.service';
import { MESSAGE_TYPES } from '@/shared/constants';
import {isChatGPTEndpoint} from "@/backend/utils/common";
import {SensitiveDataDetectedEvent} from "@/backend/types";

(function initializeFetchInterceptor() {
  const interceptor = new FetchInterceptorService({
    timeout: 60 * 1000, // 1 minute
    shouldIntercept: (url: string, method: string) => {
      return method === 'POST' && isChatGPTEndpoint(url);
    },
    onSensitiveDataDetected: (event: SensitiveDataDetectedEvent) => {
      console.log('[Interceptor] Sensitive data detected, blocking request:', event.emails);

      window.postMessage(
        {
          type: MESSAGE_TYPES.ISSUE,
          requestId: event.requestId,
          emails: event.emails,
          request: {
            url: event.url,
            method: event.method,
            body: event.body,
            headers: event.headers,
          },
        },
        '*'
      );
    },
    onRequestResolved: (requestId: string, action: string) => {
      console.log('[Interceptor] Request resolved:', requestId, action);
    },
  });

  window.fetch = interceptor.intercept.bind(interceptor);

  window.addEventListener('message', (event) => {
    if (event.data.type !== MESSAGE_TYPES.ACTION) {
      return;
    }

    const { requestId, action, body } = event.data;
    console.log('[Interceptor] Received action:', action, 'for request:', requestId);

    interceptor.resolveRequest(requestId, action, body);
  });

  window.addEventListener('beforeunload', () => {
    interceptor.clearAll();
  });

  console.log('[Interceptor] Fetch interception active');
})();