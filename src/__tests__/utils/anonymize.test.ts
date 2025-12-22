/**
 * Unit tests for anonymization utilities
 */

import {
  anonymizeEmails,
  anonymizeRequestBody,
} from '@/frontend/utils/anonymize';

describe('anonymizeEmails', () => {
  it('should replace single email with placeholder', () => {
    const result = anonymizeEmails('Contact user@example.com for help', ['user@example.com']);

    expect(result).toBe('Contact [EMAIL_1] for help');
  });

  it('should replace multiple emails with unique placeholders', () => {
    const text = 'Contact user@example.com or admin@test.org for help';
    const emails = ['user@example.com', 'admin@test.org'];

    const result = anonymizeEmails(text, emails);

    expect(result).toBe('Contact [EMAIL_1] or [EMAIL_2] for help');
  });

  it('should handle duplicate emails', () => {
    const text = 'user@example.com sent to user@example.com';
    const emails = ['user@example.com'];

    const result = anonymizeEmails(text, emails);

    expect(result).toBe('[EMAIL_1] sent to [EMAIL_1]');
  });

  it('should handle empty email array', () => {
    const result = anonymizeEmails('No emails here', []);

    expect(result).toBe('No emails here');
  });

  it('should handle empty text', () => {
    const result = anonymizeEmails('', ['user@example.com']);

    expect(result).toBe('');
  });

  it('should handle case-insensitive matching', () => {
    const text = 'USER@EXAMPLE.COM and user@example.com';
    const emails = ['user@example.com'];

    const result = anonymizeEmails(text, emails);

    expect(result).toBe('[EMAIL_1] and [EMAIL_1]');
  });

  it('should handle special characters in email', () => {
    const text = 'Contact developer+test@company.co.uk';
    const emails = ['developer+test@company.co.uk'];

    const result = anonymizeEmails(text, emails);

    expect(result).toBe('Contact [EMAIL_1]');
  });
});

describe('anonymizeRequestBody', () => {
  it('should anonymize string body', () => {
    const body = 'Contact user@example.com';
    const emails = ['user@example.com'];

    const result = anonymizeRequestBody(body, emails);

    expect(result).toBe('Contact [EMAIL_1]');
  });

  it('should handle empty emails array', () => {
    const body = 'Contact user@example.com';
    const result = anonymizeRequestBody(body, []);
    expect(result).toBe('Contact user@example.com');
  });
});
