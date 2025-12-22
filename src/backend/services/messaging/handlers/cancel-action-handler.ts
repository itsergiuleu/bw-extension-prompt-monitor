import { SendMessage } from '@/shared/types';
import { MessageHandler } from '../message-router';

export class CancelActionHandler implements MessageHandler<{ success: boolean }> {
  async handle(_message: SendMessage): Promise<{ success: boolean }> {
    console.log('[CancelActionHandler] Request cancelled by user');
    return { success: true };
  }
}