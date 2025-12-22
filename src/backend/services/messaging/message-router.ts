import { ACTION_TYPES } from '@/shared/constants';
import { MaskActionHandler } from './handlers/mask-action-handler';
import { DismissActionHandler } from './handlers/dismiss-action-handler';
import { CancelActionHandler } from './handlers/cancel-action-handler';
import { GetHistoryHandler } from './handlers/get-history-handler';
import { SendMessage } from '@/shared/types';
import { StorageService } from '@/backend/services/storage.service';

export interface MessageHandler<T = unknown> {
  handle(message: SendMessage): Promise<T>;
}

export class MessageRouter {
  private actionHandlers = new Map<string, MessageHandler>();

  constructor(private storage: StorageService) {
    this.registerDefaultHandlers();
  }

  private registerDefaultHandlers(): void {
    this.registerHandler(ACTION_TYPES.MASK, new MaskActionHandler(this.storage));
    this.registerHandler(ACTION_TYPES.DISMISS, new DismissActionHandler(this.storage));
    this.registerHandler(ACTION_TYPES.CANCEL, new CancelActionHandler());
    this.registerHandler(ACTION_TYPES.GET_HISTORY, new GetHistoryHandler(this.storage));
  }

  registerHandler(action: string, handler: MessageHandler): void {
    this.actionHandlers.set(action, handler);
  }

  async route(message: SendMessage): Promise<unknown> {
    const handler = this.actionHandlers.get(message.action);

    if (!handler) {
      throw new Error(`No handler registered for action: ${message.action}`);
    }

    return handler.handle(message);
  }
}