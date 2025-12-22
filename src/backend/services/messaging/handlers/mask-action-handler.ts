import { StorageService } from '@/backend/services/storage.service';
import { ISSUE_STATUS } from '@/shared/constants';
import { SendMessage, SendMessageData } from '@/shared/types';
import { generateId } from '@/backend/utils/common';
import { MessageHandler } from '@/backend/services/messaging/message-router';

export class MaskActionHandler implements MessageHandler<{ success: boolean }> {
  constructor(private storage: StorageService) {}

  async handle(message: SendMessage): Promise<{ success: boolean }> {
    const data = message.data as SendMessageData;

    console.log('[MaskActionHandler] Processing mask action for emails:', data.issueEmails);

    try {
      for (const issueEmail of data.issueEmails) {
        await this.storage.addIssue({
          id: generateId('issue'),
          email: issueEmail,
          status: ISSUE_STATUS.SENT,
          timestamp: Date.now(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('[MaskActionHandler] Failed to save masked emails:', error);
      throw error;
    }
  }
}