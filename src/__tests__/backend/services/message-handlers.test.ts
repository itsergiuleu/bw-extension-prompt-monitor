import { ACTION_TYPES, MESSAGE_TYPES, ISSUE_STATUS } from '@/shared/constants';
import { SendMessage, Issue } from '@/shared/types';
import {
  DismissActionHandler,
  GetHistoryHandler,
  MaskActionHandler, MessageRouter
} from "@/backend/services/messaging";

describe('Message Handlers', () => {
  describe('MaskActionHandler', () => {
    it('should save masked emails to storage', async () => {
      const mockStorage = {
        addIssue: jest.fn().mockResolvedValue(undefined),
        getHistory: jest.fn(),
        init: jest.fn(),
      };

      const handler = new MaskActionHandler(mockStorage as any);
      const message: SendMessage = {
        type: MESSAGE_TYPES.ACTION,
        action: ACTION_TYPES.MASK,
        data: {
          issueEmails: ['test1@example.com', 'test2@example.com'],
        },
      };

      const result = await handler.handle(message);

      expect(result).toEqual({ success: true });
      expect(mockStorage.addIssue).toHaveBeenCalledTimes(2);
      expect(mockStorage.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test1@example.com',
          status: ISSUE_STATUS.SENT,
        })
      );
    });

    it('should throw error if storage fails', async () => {
      const mockStorage = {
        addIssue: jest.fn().mockRejectedValue(new Error('Storage error')),
        getHistory: jest.fn(),
        init: jest.fn(),
      };

      const handler = new MaskActionHandler(mockStorage as any);
      const message: SendMessage = {
        type: MESSAGE_TYPES.ACTION,
        action: ACTION_TYPES.MASK,
        data: { issueEmails: ['test@example.com'] },
      };

      await expect(handler.handle(message)).rejects.toThrow('Storage error');
    });
  });

  describe('DismissActionHandler', () => {
    it('should save dismissed email with expiry', async () => {
      const mockStorage = {
        addIssue: jest.fn().mockResolvedValue(undefined),
        getHistory: jest.fn(),
        init: jest.fn(),
      };

      const handler = new DismissActionHandler(mockStorage as any);
      const message: SendMessage = {
        type: MESSAGE_TYPES.ACTION,
        action: ACTION_TYPES.DISMISS,
        data: { issueEmails: ['dismissed@example.com'] },
      };

      const result = await handler.handle(message);

      expect(result).toEqual({ success: true });
      expect(mockStorage.addIssue).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'dismissed@example.com',
          status: ISSUE_STATUS.DISMISSED,
          dismissedUntil: expect.any(Number),
        })
      );
    });
  });

  describe('GetHistoryHandler', () => {
    it('should retrieve history from storage', async () => {
      const mockHistory: Issue[] = [
        {
          id: 'issue-1',
          email: 'test@example.com',
          status: ISSUE_STATUS.SENT,
          timestamp: Date.now(),
        },
      ];

      const mockStorage = {
        addIssue: jest.fn(),
        getHistory: jest.fn().mockResolvedValue(mockHistory),
        init: jest.fn(),
      };

      const handler = new GetHistoryHandler(mockStorage as any);
      const message: SendMessage = {
        type: MESSAGE_TYPES.GET,
        action: ACTION_TYPES.GET_HISTORY,
      };

      const result = await handler.handle(message);

      expect(result).toEqual(mockHistory);
      expect(mockStorage.getHistory).toHaveBeenCalledTimes(1);
    });
  });

  describe('MessageRouter', () => {
    it('should route messages to correct handlers', async () => {
      const mockStorage = {
        addIssue: jest.fn().mockResolvedValue(undefined),
        getHistory: jest.fn().mockResolvedValue([]),
        init: jest.fn(),
      };

      const router = new MessageRouter(mockStorage as any);

      const maskMessage: SendMessage = {
        type: MESSAGE_TYPES.ACTION,
        action: ACTION_TYPES.MASK,
        data: { issueEmails: ['test@example.com'] },
      };

      const result = await router.route(maskMessage);

      expect(result).toEqual({ success: true });
      expect(mockStorage.addIssue).toHaveBeenCalledTimes(1);
    });

    it('should throw error for unregistered action', async () => {
      const mockStorage = {
        addIssue: jest.fn(),
        getHistory: jest.fn(),
        init: jest.fn(),
      };

      const router = new MessageRouter(mockStorage as any);

      const invalidMessage: SendMessage = {
        type: MESSAGE_TYPES.ACTION,
        action: 'INVALID_ACTION' as any,
      };

      await expect(router.route(invalidMessage)).rejects.toThrow(
        'No handler registered for action: INVALID_ACTION'
      );
    });
  });
});