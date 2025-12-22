import browser from "webextension-polyfill";

export class BrowserAPI {
  constructor(private api: typeof browser = browser) {}

  get runtime() {
    return this.api.runtime;
  }

  get storage() {
    return this.api.storage;
  }
}

/**
 * Default browser API instance
 * Use this for production code
 */
export const browserAPI = new BrowserAPI();