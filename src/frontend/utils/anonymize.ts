import {EMAIL_PLACEHOLDER_PREFIX, EMAIL_PLACEHOLDER_SUFFIX} from '@/frontend//constants';

/**
 * Replace emails in text with placeholders like [EMAIL_1], [EMAIL_2], etc.
 *
 * @param text - Text containing emails to anonymize
 * @param emails - Array of email addresses to replace
 * @returns Object containing anonymized text and email-to-placeholder mapping
 *
 * @example
 * const anonymizedText = anonymizeEmails(
 *   "Contact user@example.com or admin@test.org",
 *   ["user@example.com", "admin@test.org"]
 * );
 * // anonymizedText: "Contact [EMAIL_1] or [EMAIL_2]"
 */
export function anonymizeEmails(text: string, emails: string[]): string {
  if (!text || emails.length === 0) {
    return text;
  }

  let anonymized = text;

  const uniqueEmails = Array.from(new Set(emails));

  uniqueEmails.forEach((email, index) => {
    const placeholder = `${EMAIL_PLACEHOLDER_PREFIX}${index + 1}${EMAIL_PLACEHOLDER_SUFFIX}`;

    const regex = new RegExp(escapeRegex(email), 'gi');
    anonymized = anonymized.replace(regex, placeholder);
  });

  return anonymized;
}

export function anonymizeRequestBody(body: string, emails: string[]){
  if (!body || emails.length === 0) {
    return body;
  }

  return anonymizeEmails(body, emails);
}

/**
 * Escape special regex characters in a string
 *
 * @param str - String to escape
 * @returns Escaped string safe for use in RegExp
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}