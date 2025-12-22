import { StorageService } from '@/backend/services/storage.service';
import { SendMessage, Issue } from '@/shared/types';
import { MessageHandler } from '@/backend/services/messaging/message-router';

export class GetHistoryHandler implements MessageHandler<Issue[]> {
  constructor(private storage: StorageService) {}

  async handle(_message: SendMessage): Promise<Issue[]> {
    console.log('[GetHistoryHandler] Retrieving history');

    try {
      return await this.storage.getHistory();
    } catch (error) {
      console.error('[GetHistoryHandler] Failed to retrieve history:', error);
      throw error;
    }
  }
}