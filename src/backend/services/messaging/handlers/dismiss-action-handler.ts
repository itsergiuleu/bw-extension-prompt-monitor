import { StorageService } from '@/backend/services/storage.service';
import { ISSUE_STATUS } from '@/shared/constants';
import { SendMessage, SendMessageData } from '@/shared/types';
import { generateId } from '@/backend/utils/common';
import { MessageHandler } from '@/backend/services/messaging/message-router';

export class DismissActionHandler implements MessageHandler<{ success: boolean }> {
  constructor(private storage: StorageService) {}

  async handle(message: SendMessage): Promise<{ success: boolean }> {
    const data = message.data as SendMessageData;

    console.log('[DismissActionHandler] Processing dismiss action for email:', data.issueEmails[0]);

    try {
      await this.storage.addIssue({
        id: generateId('issue'),
        email: data.issueEmails[0],
        status: ISSUE_STATUS.DISMISSED,
        timestamp: Date.now(),
        dismissedUntil: Date.now() + (24 * 60 * 60 * 1000),
      });

      return { success: true };
    } catch (error) {
      console.error('[DismissActionHandler] Failed to save dismissed email:', error);
      throw error;
    }
  }
}