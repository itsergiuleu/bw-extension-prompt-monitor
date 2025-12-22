import { Issue } from '@/shared/types';
import { STORAGE_KEYS, MAX_HISTORY_ITEMS } from '@/backend/constants';
import { BrowserAPI, browserAPI } from '@/shared/utils/runtime';

export class StorageService {
  constructor(private browser: BrowserAPI = browserAPI) {}

  async init(): Promise<void> {
    try {
      const result = await this.browser.storage.local.get(STORAGE_KEYS.HISTORY);

      if (!result[STORAGE_KEYS.HISTORY]) {
        await this.browser.storage.local.set({ [STORAGE_KEYS.HISTORY]: [] });
      }

      console.log('[StorageService] Initialized successfully');
    } catch (error) {
      console.error('[StorageService] Failed to initialize:', error);
      throw error;
    }
  }

  async getHistory(): Promise<Issue[]> {
    try {
      const result = await this.browser.storage.local.get(STORAGE_KEYS.HISTORY);
      return (result[STORAGE_KEYS.HISTORY] as Issue[]) ?? [];
    } catch (error) {
      console.error('[StorageService] Failed to get history:', error);
      return [];
    }
  }

  async addIssue(issue: Issue): Promise<void> {
    try {
      const history = await this.getHistory();
      history.unshift(issue);

      const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

      await this.browser.storage.local.set({
        [STORAGE_KEYS.HISTORY]: trimmedHistory
      });
    } catch (error) {
      console.error('[StorageService] Failed to add issue:', error);
      throw error;
    }
  }
}
