import { StorageService } from '@/backend/services/storage.service';
import { browserAPI } from '@/shared/utils/runtime';
import { SendMessage } from '@/shared/types';
import { MessageRouter } from '@/backend/services/messaging';

(function initializeBackgroundService() {
  const storage = new StorageService(browserAPI);
  const messageRouter = new MessageRouter(storage);

  // Setup install listener
  browserAPI.runtime.onInstalled.addListener(async (details) => {
    console.log('[BackgroundService] Extension event:', details.reason);

    if (details.reason === 'install') {
      console.log('[BackgroundService] First install - initializing storage');
      try {
        await storage.init();
        console.log('[BackgroundService] Storage initialized successfully');
      } catch (error) {
        console.error('[BackgroundService] Failed to initialize storage:', error);
      }
    }
  });

  // Setup message listener
  browserAPI.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    handleMessage(message as SendMessage)
      .then(sendResponse)
      .catch((error) => {
        console.error('[BackgroundService] Message handling error:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  });

  async function handleMessage(message: SendMessage): Promise<unknown> {
    console.log('[BackgroundService] Received message:', message.type, message.action);

    if (!message.type || !message.action) {
      throw new Error('Invalid message format: missing type or action');
    }

    const response = await messageRouter.route(message);
    console.log('[BackgroundService] Message processed successfully');
    return response;
  }

  console.log('[BackgroundService] Initialized successfully');
})();