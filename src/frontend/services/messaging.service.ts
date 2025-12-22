import { MESSAGE_TYPES, ACTION_TYPES } from '@/shared/constants';
import {ActionType, Issue, MessageType, SendMessage, SendMessageData, WindowMessagePayload} from '@/shared/types';
import { browserAPI } from '@/shared/utils/runtime';

export class MessagingService {
  /**
   * Send message to browser runtime ( -> background script)
   */
  private static async sendRuntimeMessage(type: MessageType, action: ActionType, data?: SendMessageData): Promise<unknown> {
    const message: SendMessage = {
      type,
      action,
      data
    };

    return browserAPI.runtime.sendMessage(message);
  }

  /**
   * Send message to window ( -> inject script)
   */
  private static sendWindowMessage(
    action: ActionType,
    requestId?: string,
    body?: string
  ): void {
    const message: WindowMessagePayload = {
      type: MESSAGE_TYPES.ACTION,
      action,
      requestId,
      body,
    };

    window.postMessage(message, "*");
  }

  static async sendMaskAction(
    issueEmails: string[],
    requestId?: string,
    body?: string
  ): Promise<void> {
    await this.sendRuntimeMessage(MESSAGE_TYPES.ACTION, ACTION_TYPES.MASK, { issueEmails });
    this.sendWindowMessage(ACTION_TYPES.MASK, requestId, body);
  }

  static async sendDismissAction(
    issueEmails: string[],
    requestId?: string,
    body?: string
  ): Promise<void> {
    await this.sendRuntimeMessage(MESSAGE_TYPES.ACTION, ACTION_TYPES.DISMISS, { issueEmails });

    // in case there are multiple emails to dismiss, sendWindowMessage should only be called after last one is dismissed
    if (requestId && body) {
      this.sendWindowMessage(ACTION_TYPES.DISMISS, requestId, body);
    }
  }

  static sendCancelAction(requestId?: string, body?: string): void {
    this.sendWindowMessage(ACTION_TYPES.CANCEL, requestId, body);
  }

  static sendContinueAction(requestId?: string, body?: string): void {
    this.sendWindowMessage(ACTION_TYPES.CONTINUE, requestId, body);
  }

  static async getHistory() {
    return this.sendRuntimeMessage(MESSAGE_TYPES.GET, ACTION_TYPES.GET_HISTORY).then(response => {
      return response as unknown as Issue[]
    })
  }
}