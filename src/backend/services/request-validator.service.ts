import { EMAIL_REGEX } from '@/backend/constants';
import { SensitiveDataItem, SensitiveDataResult } from '@/backend/types';

class RequestValidatorService {
  /**
   * Extracts and converts request body to string format
   */
  extractRequestBody(body: unknown): string | null {
    if (!body) return null;

    if (typeof body === 'string') {
      return body;
    }

    if (body instanceof FormData) {
      const obj: Record<string, unknown> = {};
      body.forEach((value, key) => {
        obj[key] = value;
      });
      return JSON.stringify(obj, null, 2);
    }

    if (body instanceof URLSearchParams) {
      return body.toString();
    }

    console.warn('[RequestValidator] Unsupported body type:', typeof body);
    return null;
  }

  /**
   * Finds sensitive data patterns in text
   */
  findSensitiveData(text: string): SensitiveDataResult {
    const sensitiveItems: SensitiveDataItem[] = [];

    for (const [type, pattern] of Object.entries({ email: EMAIL_REGEX })) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach((match) => {
          sensitiveItems.push({
            type,
            value: match,
          });
        });
      }
    }

    return {
      success: sensitiveItems.length > 0,
      data: sensitiveItems,
    };
  }

  /**
   * Validates request body for sensitive data
   */
  validateRequest(body: unknown): SensitiveDataResult {
    const bodyString = this.extractRequestBody(body);

    if (!bodyString) {
      return {
        success: false,
        data: [],
      };
    }

    return this.findSensitiveData(bodyString);
  }
}

export const requestValidator = new RequestValidatorService();