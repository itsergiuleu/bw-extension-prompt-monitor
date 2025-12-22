import { requestValidator } from '@/backend/services/request-validator.service';
import {InterceptorConfig, PendingRequest, SensitiveDataResult } from "@/backend/types";
import { generateId } from "@/backend/utils/common";
import {ACTION_TYPES} from "@/shared/constants";

export class FetchInterceptorService {
  private pendingRequests = new Map<string, PendingRequest>();
  private originalFetch: typeof fetch;

  constructor(
    private config: InterceptorConfig,
    private validator = requestValidator,
    fetchImpl: typeof fetch = window.fetch
  ) {
    this.originalFetch = fetchImpl.bind(window);
  }

  /**
   * Intercept fetch request and validate for sensitive data
   */
  async intercept(...args: Parameters<typeof fetch>): Promise<Response> {
    const [resource, config] = args;
    const url = resource instanceof Request ? resource.url : resource.toString();
    const method = config?.method || (resource instanceof Request ? resource.method : 'GET');

    // Skip non-target requests
    if (!this.config.shouldIntercept(url, method)) {
      return this.originalFetch.apply(window, args);
    }

    // Validate request body
    const sensitiveDataResult = this.validator.validateRequest(config?.body);

    if (!sensitiveDataResult.success || sensitiveDataResult.data.length === 0) {
      return this.originalFetch.apply(window, args);
    }

    // Block and notify about sensitive data
    return this.blockRequest(args, url, method, config, sensitiveDataResult);
  }

  /**
   * Block request and wait for user action
   */
  private blockRequest(
    args: Parameters<typeof fetch>,
    url: string,
    method: string,
    config: RequestInit | undefined,
    sensitiveDataResult: SensitiveDataResult
  ): Promise<Response> {
    const requestId = generateId('req');
    const emails = sensitiveDataResult.data.map((item) => item.value);
    const bodyString = this.validator.extractRequestBody(config?.body);

    return new Promise<Response>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.cleanupRequest(requestId, new Error('Request timeout - no user action taken'));
      }, this.config.timeout);

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        originalArgs: args,
        timeoutId,
      });

      this.config.onSensitiveDataDetected({
        requestId,
        emails,
        url,
        method,
        body: bodyString,
        headers: (config?.headers as Record<string, string>) || {},
      });
    });
  }

  resolveRequest(requestId: string, action: string, modifiedBody?: unknown): void {
    const pending = this.pendingRequests.get(requestId);

    if (!pending) {
      console.error('[FetchInterceptor] No pending request found for ID:', requestId);
      return;
    }

    clearTimeout(pending.timeoutId);
    this.pendingRequests.delete(requestId);

    if (action === ACTION_TYPES.CANCEL) {
      pending.reject(new Error('Request canceled by user!'));
      this.config.onRequestResolved(requestId, action);
      return;
    }

    // Execute original request with modified body
    const [resource, originalConfig] = pending.originalArgs;
    const modifiedConfig: RequestInit = {
      ...originalConfig,
      body: modifiedBody
        ? typeof modifiedBody === 'string'
          ? modifiedBody
          : JSON.stringify(modifiedBody)
        : originalConfig?.body,
    };

    pending.resolve(this.originalFetch(resource, modifiedConfig));
    this.config.onRequestResolved(requestId, action);
  }

  private cleanupRequest(requestId: string, error: Error): void {
    const pending = this.pendingRequests.get(requestId);
    if (pending) {
      clearTimeout(pending.timeoutId);
      this.pendingRequests.delete(requestId);
      pending.reject(error);
    }
  }

  /**
   * Clear all pending requests (useful for cleanup)
   */
  clearAll(): void {
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error('Interceptor cleared'));
    });
    this.pendingRequests.clear();
  }
}